import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import styles from './FileUploader.module.css';
import { FiUploadCloud, FiDownload, FiGlobe, FiMoon, FiSun } from 'react-icons/fi';
import { AZURE_CONFIG } from '../config/azure';

function FileUploader() {
  const { t, interfaceLanguage, isDarkMode, changeLanguage, toggleTheme } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('he');
  const [translatedContent, setTranslatedContent] = useState('');
  const [translationProgress, setTranslationProgress] = useState(0);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const fileInputRef = useRef(null);

  const languages = {
    'af': 'אפריקאנס',
    'ar': 'ערבית',
    'bg': 'בולגרית',
    'bn': 'בנגלית',
    'bs': 'בוסנית',
    'ca': 'קטלאנית',
    'cs': 'צ׳כית',
    'cy': 'וולשית',
    'da': 'דנית',
    'de': 'גרמנית',
    'el': 'יוונית',
    'en': 'אנגלית',
    'es': 'ספרדית',
    'et': 'אסטונית',
    'fa': 'פרסית',
    'fi': 'פינית',
    'fr': 'צרפתית',
    'he': 'עברית',
    'hi': 'הינדי',
    'hr': 'קרואטית',
    'hu': 'הונגרית',
    'id': 'אינדונזית',
    'is': 'איסלנדית',
    'it': 'איטלקית',
    'ja': 'יפנית',
    'ko': 'קוריאנית',
    'lt': 'ליטאית',
    'lv': 'לטבית',
    'ms': 'מלאית',
    'mt': 'מלטזית',
    'nl': 'הולנדית',
    'no': 'נורווגית',
    'pl': 'פולנית',
    'pt': 'פורטוגזית',
    'ro': 'רומנית',
    'ru': 'רוסית',
    'sk': 'סלובקית',
    'sl': 'סלובנית',
    'sv': 'שוודית',
    'sw': 'סווהילי',
    'th': 'תאית',
    'tr': 'טורקית',
    'uk': 'אוקראינית',
    'ur': 'אורדו',
    'vi': 'וייטנאמית',
    'zh-Hans': 'סינית פשוטה',
    'zh-Hant': 'סינית מסורתית'
  };

  const interfaceLanguages = {
    he: 'עברית',
    en: 'English',
    ar: 'العربية',
    ru: 'Русский'
  };

  const translations = {
    he: {
      targetLanguageLabel: "לאיזו שפה תרצה לתרגם?",
      direction: "rtl",
      uploadSuccess: "הקובץ הועלה בהצלחה!",
      languages: {
        'af': 'אפריקאנס',
        'ar': 'ערבית',
        'bg': 'בולגרית',
        'bn': 'בנגלית',
        'bs': 'בוסנית',
        'ca': 'קטלאנית',
        'cs': 'צ׳כית',
        'cy': 'וולשית',
        'da': 'דנית',
        'de': 'גרמנית',
        'el': 'יוונית',
        'en': 'אנגלית',
        'es': 'ספרדית',
        'et': 'אסטונית',
        'fa': 'פרסית',
        'fi': 'פינית',
        'fr': 'צרפתית',
        'he': 'עברית',
        'hi': 'הינדי',
        'hr': 'קרואטית',
        'hu': 'הונגרית',
        'id': 'אינדונזית',
        'is': 'איסלנדית',
        'it': 'איטלקית',
        'ja': 'יפנית',
        'ko': 'קוריאנית',
        'lt': 'ליטאית',
        'lv': 'לטבית',
        'ms': 'מלאית',
        'mt': 'מלטזית',
        'nl': 'הולנדית',
        'no': 'נורווגית',
        'pl': 'פולנית',
        'pt': 'פורטוגזית',
        'ro': 'רומנית',
        'ru': 'רוסית',
        'sk': 'סלובקית',
        'sl': 'סלובנית',
        'sv': 'שוודית',
        'sw': 'סווהילי',
        'th': 'תאית',
        'tr': 'טורקית',
        'uk': 'אוקראינית',
        'ur': 'אורדו',
        'vi': 'וייטנאמית',
        'zh-Hans': 'סינית פשוטה',
        'zh-Hant': 'סינית מסורתית'
      }
    },
    en: {
      targetLanguageLabel: "Which language would you like to translate to?",
      direction: "ltr",
      uploadSuccess: "File uploaded successfully!",
      languages: {
        'af': 'Afrikaans',
        'ar': 'Arabic',
        'bg': 'Bulgarian',
        'bn': 'Bengali',
        'bs': 'Bosnian',
        'ca': 'Catalan',
        'cs': 'Czech',
        'cy': 'Welsh',
        'da': 'Danish',
        'de': 'German',
        'el': 'Greek',
        'en': 'English',
        'es': 'Spanish',
        'et': 'Estonian',
        'fa': 'Persian',
        'fi': 'Finnish',
        'fr': 'French',
        'he': 'Hebrew',
        'hi': 'Hindi',
        'hr': 'Croatian',
        'hu': 'Hungarian',
        'id': 'Indonesian',
        'is': 'Icelandic',
        'it': 'Italian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'lt': 'Lithuanian',
        'lv': 'Latvian',
        'ms': 'Malay',
        'mt': 'Maltese',
        'nl': 'Dutch',
        'no': 'Norwegian',
        'pl': 'Polish',
        'pt': 'Portuguese',
        'ro': 'Romanian',
        'ru': 'Russian',
        'sk': 'Slovak',
        'sl': 'Slovenian',
        'sv': 'Swedish',
        'sw': 'Swahili',
        'th': 'Thai',
        'tr': 'Turkish',
        'uk': 'Ukrainian',
        'ur': 'Urdu',
        'vi': 'Vietnamese',
        'zh-Hans': 'Simplified Chinese',
        'zh-Hant': 'Traditional Chinese'
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add(styles.dragOver);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.dragOver);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.dragOver);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.srt')) {
      handleFileUpload({ target: { files: [file] } });
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage('');
      setIsLoading(true);
      
      try {
        const content = await readFileContent(file);
        setFileContent(content);
        const detectedLang = await detectLanguage(content.slice(0, 1000));
        setDetectedLanguage(detectedLang);
        setMessage(translations[interfaceLanguage]?.uploadSuccess || translations.he.uploadSuccess);
      } catch (error) {
        setMessage(t.uploadError);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const detectLanguage = async (text) => {
    try {
      const response = await fetch(`${AZURE_CONFIG.endpoint}/detect?api-version=3.0`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_CONFIG.key,
          'Ocp-Apim-Subscription-Region': AZURE_CONFIG.region,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{ text }])
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Azure API Error:', errorData);
        throw new Error(`Language detection failed: ${response.status}`);
      }

      const [result] = await response.json();
      return result.language;
    } catch (error) {
      console.error('Error detecting language:', error);
      throw error;
    }
  };

  const translateText = async (text, targetLang) => {
    const endpoint = AZURE_CONFIG.endpoint;
    const key = AZURE_CONFIG.key;

    try {
      const response = await fetch(
        `${endpoint}/translate?api-version=3.0&to=${targetLang}`,
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Ocp-Apim-Subscription-Region': AZURE_CONFIG.region,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{ text }]),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Azure API Error:', errorData);
        throw new Error(`Translation failed: ${response.status}`);
      }

      const [result] = await response.json();
      return result.translations[0].text;
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  };

  const handleTranslate = async () => {
    if (!fileContent || !targetLanguage) return;
    
    setIsLoading(true);
    setTranslationProgress(0);
    
    try {
      const lines = fileContent.split('\n');
      const translatedLines = [];
      let progress = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!/^\d/.test(line.trim()) && !/^\d{2}:\d{2}:\d{2}/.test(line.trim()) && line.trim()) {
          const translatedLine = await translateText(line, targetLanguage);
          translatedLines.push(translatedLine);
        } else {
          translatedLines.push(line);
        }

        progress = Math.round(((i + 1) / lines.length) * 100);
        setTranslationProgress(progress);
      }

      setTranslatedContent(translatedLines.join('\n'));
      setMessage(t.translationSuccess);
    } catch (error) {
      setMessage(t.translationError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!translatedContent || !selectedFile) return;
    
    const originalName = selectedFile.name.replace('.srt', '');
    
    const newFileName = `${originalName}.${targetLanguage}.srt`;
    
    const blob = new Blob([translatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = newFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.header}>
        <div className={styles.languageToggle}>
          <FiGlobe className={styles.icon} />
          <select
            value={interfaceLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className={styles.languageSelector}
          >
            {Object.entries(interfaceLanguages).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={toggleTheme}
          className={styles.themeToggle}
        >
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>

      <div 
        className={styles.uploadSection}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".srt"
          onChange={handleFileUpload}
          className={styles.hiddenInput}
        />
        
        <div className={styles.uploadContent} onClick={() => fileInputRef.current.click()}>
          <FiUploadCloud className={styles.uploadIcon} />
          {selectedFile ? (
            <>
              <h3>{selectedFile.name}</h3>
              <p>{t.clickToChangeFile}</p>
            </>
          ) : (
            <>
              <h3>{t.uploadFile}</h3>
              <p>{t.dragAndDrop}</p>
            </>
          )}
        </div>
      </div>

      {fileContent && (
        <div className={styles.translationSection}>
          {detectedLanguage && (
            <div className={styles.detectedLanguage}>
              <FiGlobe className={styles.icon} />
              {t.detectedLanguage} {languages[detectedLanguage]}
            </div>
          )}
          
          <div className={styles.targetLanguageWrapper} dir={translations[interfaceLanguage]?.direction || "rtl"}>
            <label className={styles.targetLanguageLabel}>
              {translations[interfaceLanguage]?.targetLanguageLabel || "לאיזו שפה תרצה לתרגם?"}
            </label>
            
            <select
              className={styles.targetLanguageSelect}
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              disabled={isLoading}
              dir={translations[interfaceLanguage]?.direction || "rtl"}
            >
              {Object.entries(languages)
                .filter(([code]) => code !== detectedLanguage)
                .sort((a, b) => {
                  const lang1 = translations[interfaceLanguage]?.languages[a[0]] || a[1];
                  const lang2 = translations[interfaceLanguage]?.languages[b[0]] || b[1];
                  return lang1.localeCompare(lang2, interfaceLanguage === 'he' ? 'he' : 'en');
                })
                .map(([code, _]) => (
                  <option key={code} value={code}>
                    {translations[interfaceLanguage]?.languages[code] || translations.he.languages[code]}
                  </option>
                ))}
            </select>
          </div>

          <button
            onClick={handleTranslate}
            disabled={isLoading || targetLanguage === detectedLanguage}
            className={styles.translateButton}
          >
            {isLoading ? t.translating : t.translate}
          </button>
        </div>
      )}

      {isLoading && translationProgress > 0 && (
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${translationProgress}%` }}
          >
            <span className={styles.progressText}>{translationProgress}%</span>
          </div>
        </div>
      )}

      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}

      {translatedContent && !isLoading && (
        <button
          onClick={handleDownload}
          className={styles.downloadButton}
        >
          <FiDownload className={styles.icon} />
          {t.downloadFile}
        </button>
      )}
    </div>
  );
}

export default FileUploader;