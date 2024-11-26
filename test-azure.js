const path = require('path');
const dotenv = require('dotenv');

// טעינת קובץ .env
const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('שגיאה בטעינת קובץ .env:', result.error.message);
  process.exit(1);
}

const testAzureConnection = async () => {
  const AZURE_ENDPOINT = process.env.REACT_APP_AZURE_TRANSLATOR_ENDPOINT;
  const AZURE_KEY = process.env.REACT_APP_AZURE_TRANSLATOR_KEY;
  const AZURE_REGION = process.env.REACT_APP_AZURE_REGION;

  console.log('\nבודק הגדרות מקובץ .env:');
  console.log('----------------------------------------');
  console.log('AZURE_ENDPOINT:', AZURE_ENDPOINT || 'חסר');
  console.log('AZURE_REGION:', AZURE_REGION || 'חסר');
  console.log('AZURE_KEY:', AZURE_KEY ? 'קיים' : 'חסר');
  console.log('----------------------------------------\n');

  // בדיקת תקינות המשתנים
  if (!AZURE_ENDPOINT || !AZURE_KEY || !AZURE_REGION) {
    console.error('שגיאה: חסרים משתנים בקובץ .env');
    console.log('וודא שהקובץ .env מכיל את המשתנים הבאים:');
    console.log('REACT_APP_AZURE_TRANSLATOR_ENDPOINT');
    console.log('REACT_APP_AZURE_TRANSLATOR_KEY');
    console.log('REACT_APP_AZURE_REGION');
    process.exit(1);
  }

  const testText = 'Hello, this is a test message.';
  
  try {
    console.log('מנסה לתרגם טקסט בדיקה:', testText);

    const response = await fetch(`${AZURE_ENDPOINT}/translate?api-version=3.0&to=he`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_KEY,
        'Ocp-Apim-Subscription-Region': AZURE_REGION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        text: testText
      }])
    });

    console.log('קוד תגובה מהשרת:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`שגיאת שרת: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('\nהתרגום הצליח!');
    console.log('טקסט מקורי:', testText);
    console.log('תרגום:', data[0].translations[0].text);
    console.log('\nהחיבור ל-Azure תקין! 👍');

  } catch (error) {
    console.error('\nשגיאה בבדיקה:', error.message);
    process.exit(1);
  }
};

// התקנת fetch עבור Node.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

testAzureConnection(); 