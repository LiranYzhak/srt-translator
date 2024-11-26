import { supabase } from './supabaseClient'

const AZURE_ENDPOINT = process.env.REACT_APP_AZURE_TRANSLATOR_ENDPOINT
const AZURE_KEY = process.env.REACT_APP_AZURE_TRANSLATOR_KEY
const AZURE_REGION = process.env.REACT_APP_AZURE_REGION

// פונקציית השהייה
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// פורקציה לניקוי טקסט
const cleanText = (text) => {
  return text
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ');
};

// פונקציה לחלוקת טקסט לחלקים קטנים
const splitIntoSmallChunks = (text, maxLength = 3000) => {
  const cleanedText = cleanText(text);
  if (cleanedText.length <= maxLength) {
    return [cleanedText];
  }

  const chunks = [];
  const sentences = cleanedText.split(/([.!?]+\s)/);
  let currentChunk = '';

  for (let sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

// פונקציה לתרגום טקסט בודד
const translateSingleText = async (text, targetLang, retries = 3) => {
  const chunks = splitIntoSmallChunks(text);
  let translatedText = '';

  for (const chunk of chunks) {
    if (!chunk) continue;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        console.log(`מתרגם חלק באורך ${chunk.length} תווים`);

        const response = await fetch(`${AZURE_ENDPOINT}/translate?api-version=3.0&to=${targetLang}`, {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': AZURE_KEY,
            'Ocp-Apim-Subscription-Region': AZURE_REGION,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{ text: chunk }])
        });

        if (response.status === 429) {
          console.log('התקבלה שגיאת Rate Limit, ממתין...');
          const retryAfter = parseInt(response.headers.get('Retry-After') || '2');
          await delay(retryAfter * 1000);
          continue;
        }

        const responseText = await response.text();
        
        if (!response.ok) {
          throw new Error(`שגיאת שרת: ${response.status} - ${responseText}`);
        }

        const data = JSON.parse(responseText);
        translatedText += ' ' + data[0].translations[0].text;
        
        // המתנה קצרה בין חלקים
        await delay(1000);
        break;
      } catch (error) {
        console.error(`ניסיון ${attempt + 1} נכשל:`, error);
        if (attempt === retries - 1) throw error;
        await delay(2000 * (attempt + 1));
      }
    }
  }

  return translatedText.trim();
};

// פונקציה לפירוק קובץ SRT
const parseSRT = (content) => {
  try {
    const blocks = content.trim().split('\n\n');
    return blocks.map((block, index) => {
      const lines = block.split('\n');
      if (lines.length < 3) {
        throw new Error(`בלוק לא תקין במיקום ${index + 1}`);
      }
      return {
        index: index + 1,
        timeCode: lines[1],
        text: lines.slice(2).join('\n')
      };
    });
  } catch (error) {
    console.error('שגיאה בפירוק הקובץ:', error);
    throw new Error(`שגיאה בפירוק הקובץ: ${error.message}`);
  }
};

export const translateSRT = async (content, targetLang, onProgress) => {
  try {
    console.log('מתחיל תרגום...'); // לוג לבדיקה
    const blocks = parseSRT(content);
    console.log(`נמצאו ${blocks.length} בלוקים`); // לוג לבדיקה
    
    const translatedBlocks = [];
    let lastProgress = 0;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      try {
        console.log(`מתרגם בלוק ${i + 1}/${blocks.length}`); // לוג לבדיקה
        const translatedText = await translateSingleText(block.text, targetLang);
        translatedBlocks.push({
          ...block,
          text: translatedText
        });

        const progress = Math.round(((i + 1) / blocks.length) * 100);
        if (progress > lastProgress) {
          lastProgress = progress;
          if (onProgress) {
            onProgress(progress);
          }
        }
      } catch (error) {
        console.error(`שגיאה בתרגום בלוק ${i + 1}:`, error);
        throw new Error(`שגיאה בתרגום בלוק ${i + 1}: ${error.message}`);
      }
    }

    const result = translatedBlocks
      .map(block => `${block.index}\n${block.timeCode}\n${block.text}`)
      .join('\n\n');
    
    console.log('התרגום הושלם בהצלחה'); // לוג לבדיקה
    return result;
  } catch (error) {
    console.error('שגיאה בתרגום הקובץ:', error);
    throw error;
  }
};

export const uploadFile = async (file) => {
  try {
    const fileName = `${Date.now()}-${file.name}`
    const { data: storageData, error: storageError } = await supabase.storage
      .from('srt-files')
      .upload(fileName, file)
    
    if (storageError) throw storageError

    const { data: fileData, error: dbError } = await supabase
      .from('files')
      .insert([
        { 
          name: file.name,
          storage_path: storageData.path,
          size: file.size,
          created_at: new Date()
        }
      ])
      .select()
    
    if (dbError) throw dbError
    return fileData[0]
  } catch (error) {
    console.error('שגיאה בהעלאת הקובץ:', error.message)
    throw error
  }
}

export const getFiles = async () => {
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('שגיאה בקבלת הקבצים:', error.message)
    throw error
  }
} 