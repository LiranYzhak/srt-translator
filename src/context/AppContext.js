import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [interfaceLanguage, setInterfaceLanguage] = useState('he');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const translations = {
    he: {
      uploadFile: 'העלה קובץ',
      translate: 'תרגם',
      translating: 'מתרגם...',
      downloadFile: 'הורד קובץ מתורגם',
      detectedLanguage: 'שפה מזוהה:',
      selectTargetLanguage: 'בחר שפת יעד',
      interfaceLanguage: 'שפת ממשק',
      darkMode: 'מצב כהה',
      lightMode: 'מצב בהיר',
      uploadSuccess: 'הקובץ הועלה בהצלחה!',
      translationSuccess: 'התרגום הושלם בהצלחה!',
      dragAndDrop: 'גרור קובץ לכאן או לחץ לבחירה'
    },
    en: {
      uploadFile: 'Upload File',
      translate: 'Translate',
      translating: 'Translating...',
      downloadFile: 'Download Translated File',
      detectedLanguage: 'Detected Language:',
      selectTargetLanguage: 'Select Target Language',
      interfaceLanguage: 'Interface Language',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      uploadSuccess: 'File uploaded successfully!',
      translationSuccess: 'Translation completed successfully!',
      dragAndDrop: 'Drag and drop a file here or click to select a file'
    },
    ar: {
      uploadFile: 'تحميل ملف',
      translate: 'ترجم',
      translating: 'جاري الترجمة...',
      downloadFile: 'تحميل الملف المترجم',
      detectedLanguage: 'اللغة المكتشفة:',
      selectTargetLanguage: 'اختر لغة الهدف',
      interfaceLanguage: 'لغة الواجهة',
      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح',
      uploadSuccess: 'تم تحميل الملف بنجاح!',
      translationSuccess: 'اكتملت الترجمة بنجاح!',
      dragAndDrop: 'أسحب ملف إلى هذا المكان أو اضغط لاختيار ملف'
    },
    ru: {
      uploadFile: 'Загрузить файл',
      translate: 'Перевести',
      translating: 'Перевод...',
      downloadFile: 'Скачать переведенный файл',
      detectedLanguage: 'Обнаруженный язык:',
      selectTargetLanguage: 'Выберите целевой язык',
      interfaceLanguage: 'Язык интерфейса',
      darkMode: 'Темный режим',
      lightMode: 'Светлый режим',
      uploadSuccess: 'Файл успешно загружен!',
      translationSuccess: 'Перевод успешно завершен!',
      dragAndDrop: 'Перетащите файл сюда или щелкните для выбора файла'
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('interfaceLanguage');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedLanguage) setInterfaceLanguage(savedLanguage);
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  const changeLanguage = (lang) => {
    setInterfaceLanguage(lang);
    localStorage.setItem('interfaceLanguage', lang);
    document.dir = ['ar', 'he'].includes(lang) ? 'rtl' : 'ltr';
  };

  const value = {
    t: translations[interfaceLanguage],
    interfaceLanguage,
    changeLanguage,
    isDarkMode,
    toggleTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}; 