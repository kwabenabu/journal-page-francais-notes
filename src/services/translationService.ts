
interface TranslationResult {
  translatedText: string;
  sourceLanguage: 'en' | 'fr';
  targetLanguage: 'en' | 'fr';
}

// Simple translation dictionary for common words
const translations: Record<string, { en: string; fr: string }> = {
  'hello': { en: 'hello', fr: 'bonjour' },
  'bonjour': { en: 'hello', fr: 'bonjour' },
  'good': { en: 'good', fr: 'bon' },
  'bon': { en: 'good', fr: 'bon' },
  'yes': { en: 'yes', fr: 'oui' },
  'oui': { en: 'yes', fr: 'oui' },
  'no': { en: 'no', fr: 'non' },
  'non': { en: 'no', fr: 'non' },
  'thank': { en: 'thank', fr: 'merci' },
  'merci': { en: 'thank', fr: 'merci' },
  'please': { en: 'please', fr: 's\'il vous plaît' },
  'water': { en: 'water', fr: 'eau' },
  'eau': { en: 'water', fr: 'eau' },
  'food': { en: 'food', fr: 'nourriture' },
  'nourriture': { en: 'food', fr: 'nourriture' },
  'house': { en: 'house', fr: 'maison' },
  'maison': { en: 'house', fr: 'maison' },
  'love': { en: 'love', fr: 'amour' },
  'amour': { en: 'love', fr: 'amour' },
  'beautiful': { en: 'beautiful', fr: 'beau' },
  'beau': { en: 'beautiful', fr: 'beau' },
  'time': { en: 'time', fr: 'temps' },
  'temps': { en: 'time', fr: 'temps' },
  'day': { en: 'day', fr: 'jour' },
  'jour': { en: 'day', fr: 'jour' },
  'night': { en: 'night', fr: 'nuit' },
  'nuit': { en: 'night', fr: 'nuit' },
  'friend': { en: 'friend', fr: 'ami' },
  'ami': { en: 'friend', fr: 'ami' },
  'work': { en: 'work', fr: 'travail' },
  'travail': { en: 'work', fr: 'travail' },
  'school': { en: 'school', fr: 'école' },
  'école': { en: 'school', fr: 'école' },
  'book': { en: 'book', fr: 'livre' },
  'livre': { en: 'book', fr: 'livre' },
  'write': { en: 'write', fr: 'écrire' },
  'écrire': { en: 'write', fr: 'écrire' },
  'read': { en: 'read', fr: 'lire' },
  'lire': { en: 'read', fr: 'lire' },
  'think': { en: 'think', fr: 'penser' },
  'penser': { en: 'think', fr: 'penser' },
  'today': { en: 'today', fr: 'aujourd\'hui' },
  'aujourd\'hui': { en: 'today', fr: 'aujourd\'hui' },
  'tomorrow': { en: 'tomorrow', fr: 'demain' },
  'demain': { en: 'tomorrow', fr: 'demain' },
  'yesterday': { en: 'yesterday', fr: 'hier' },
  'hier': { en: 'yesterday', fr: 'hier' },
};

function detectLanguage(word: string): 'en' | 'fr' {
  const lowerWord = word.toLowerCase();
  
  // Check if it's a known French word
  const frenchWords = ['bonjour', 'bon', 'oui', 'non', 'merci', 'eau', 'nourriture', 'maison', 'amour', 'beau', 'temps', 'jour', 'nuit', 'ami', 'travail', 'école', 'livre', 'écrire', 'lire', 'penser', 'aujourd\'hui', 'demain', 'hier'];
  if (frenchWords.includes(lowerWord)) {
    return 'fr';
  }
  
  // Default to English
  return 'en';
}

export function translateWord(word: string): TranslationResult | null {
  const cleanWord = word.toLowerCase().replace(/[.,!?;:"'()]/g, '');
  const translation = translations[cleanWord];
  
  if (!translation) {
    return null;
  }
  
  const sourceLanguage = detectLanguage(cleanWord);
  const targetLanguage = sourceLanguage === 'en' ? 'fr' : 'en';
  
  return {
    translatedText: translation[targetLanguage],
    sourceLanguage,
    targetLanguage
  };
}

export function getGoogleTranslateUrl(word: string, sourceLang: string, targetLang: string): string {
  return `https://translate.google.com/?sl=${sourceLang}&tl=${targetLang}&text=${encodeURIComponent(word)}`;
}

export function getWordReferenceUrl(word: string, sourceLang: string, targetLang: string): string {
  const langPair = sourceLang === 'en' ? 'enfr' : 'fren';
  return `https://www.wordreference.com/${langPair}/${encodeURIComponent(word)}`;
}
