export const AZURE_CONFIG = {
  endpoint: "https://api.cognitive.microsofttranslator.com",
  key: process.env.REACT_APP_AZURE_TRANSLATOR_KEY,
  region: process.env.REACT_APP_AZURE_REGION
};

if (!AZURE_CONFIG.key) {
  console.error('Azure API key is missing! Make sure REACT_APP_AZURE_TRANSLATOR_KEY is set in .env file');
}

if (!AZURE_CONFIG.region) {
  console.error('Azure region is missing! Make sure REACT_APP_AZURE_REGION is set in .env file');
} 