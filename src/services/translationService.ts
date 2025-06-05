
interface TranslationResult {
  translatedText: string;
  sourceLanguage: 'en' | 'fr';
  targetLanguage: 'en' | 'fr';
}

// Expanded translation dictionary for words, phrases, and common sentences
const translations: Record<string, { en: string; fr: string }> = {
  // Single words
  'hello': { en: 'hello', fr: 'bonjour' },
  'bonjour': { en: 'hello', fr: 'bonjour' },
  'good': { en: 'good', fr: 'bon' },
  'bon': { en: 'good', fr: 'bon' },
  'yes': { en: 'yes', fr: 'oui' },
  'oui': { en: 'yes', fr: 'oui' },
  'no': { en: 'no', fr: 'non' },
  'non': { en: 'no', fr: 'non' },
  'thank': { en: 'thank', fr: 'merci' },
  'merci': { en: 'thank you', fr: 'merci' },
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
  
  // Common phrases
  'how are you': { en: 'how are you', fr: 'comment allez-vous' },
  'comment allez-vous': { en: 'how are you', fr: 'comment allez-vous' },
  'comment ça va': { en: 'how are you', fr: 'comment ça va' },
  'thank you': { en: 'thank you', fr: 'merci' },
  'thank you very much': { en: 'thank you very much', fr: 'merci beaucoup' },
  'merci beaucoup': { en: 'thank you very much', fr: 'merci beaucoup' },
  'excuse me': { en: 'excuse me', fr: 'excusez-moi' },
  'excusez-moi': { en: 'excuse me', fr: 'excusez-moi' },
  'i love you': { en: 'i love you', fr: 'je t\'aime' },
  'je t\'aime': { en: 'i love you', fr: 'je t\'aime' },
  'good morning': { en: 'good morning', fr: 'bonjour' },
  'good evening': { en: 'good evening', fr: 'bonsoir' },
  'bonsoir': { en: 'good evening', fr: 'bonsoir' },
  'good night': { en: 'good night', fr: 'bonne nuit' },
  'bonne nuit': { en: 'good night', fr: 'bonne nuit' },
  'see you later': { en: 'see you later', fr: 'à bientôt' },
  'à bientôt': { en: 'see you later', fr: 'à bientôt' },
  'what time is it': { en: 'what time is it', fr: 'quelle heure est-il' },
  'quelle heure est-il': { en: 'what time is it', fr: 'quelle heure est-il' },
  
  // Common sentences
  'i am fine': { en: 'i am fine', fr: 'je vais bien' },
  'je vais bien': { en: 'i am fine', fr: 'je vais bien' },
  'what is your name': { en: 'what is your name', fr: 'comment vous appelez-vous' },
  'comment vous appelez-vous': { en: 'what is your name', fr: 'comment vous appelez-vous' },
  'where are you from': { en: 'where are you from', fr: 'd\'où venez-vous' },
  'd\'où venez-vous': { en: 'where are you from', fr: 'd\'où venez-vous' },
  'i don\'t understand': { en: 'i don\'t understand', fr: 'je ne comprends pas' },
  'je ne comprends pas': { en: 'i don\'t understand', fr: 'je ne comprends pas' },
  'do you speak english': { en: 'do you speak english', fr: 'parlez-vous anglais' },
  'parlez-vous anglais': { en: 'do you speak english', fr: 'parlez-vous anglais' },
  'i speak french': { en: 'i speak french', fr: 'je parle français' },
  'je parle français': { en: 'i speak french', fr: 'je parle français' },
  'where is the bathroom': { en: 'where is the bathroom', fr: 'où sont les toilettes' },
  'où sont les toilettes': { en: 'where is the bathroom', fr: 'où sont les toilettes' },
};

function detectLanguage(text: string): 'en' | 'fr' {
  const lowerText = text.toLowerCase().trim();
  
  // Check if it's a known French word/phrase
  const frenchWords = ['bonjour', 'bon', 'oui', 'non', 'merci', 'eau', 'nourriture', 'maison', 'amour', 'beau', 'temps', 'jour', 'nuit', 'ami', 'travail', 'école', 'livre', 'écrire', 'lire', 'penser', 'aujourd\'hui', 'demain', 'hier'];
  const frenchPhrases = ['comment allez-vous', 'comment ça va', 'merci beaucoup', 'excusez-moi', 'je t\'aime', 'bonsoir', 'bonne nuit', 'à bientôt', 'quelle heure est-il', 'je vais bien', 'comment vous appelez-vous', 'd\'où venez-vous', 'je ne comprends pas', 'parlez-vous anglais', 'je parle français', 'où sont les toilettes'];
  
  // Check for exact matches first
  if (frenchWords.includes(lowerText) || frenchPhrases.includes(lowerText)) {
    return 'fr';
  }
  
  // Check if any French words are contained in the text
  if (frenchWords.some(word => lowerText.includes(word)) || frenchPhrases.some(phrase => lowerText.includes(phrase))) {
    return 'fr';
  }
  
  // Check for French-specific characters
  if (/[àâäéèêëîïôöùûüÿç]/.test(lowerText)) {
    return 'fr';
  }
  
  // Default to English
  return 'en';
}

export function translateWord(text: string): TranslationResult | null {
  const cleanText = text.toLowerCase()
    .replace(/[.,!?;:"'()]/g, '')
    .trim();
  
  // Try exact match first
  let translation = translations[cleanText];
  
  // If no exact match, try to find a partial match for longer phrases
  if (!translation) {
    const matchingKey = Object.keys(translations).find(key => 
      cleanText.includes(key) || key.includes(cleanText)
    );
    if (matchingKey) {
      translation = translations[matchingKey];
    }
  }
  
  if (!translation) {
    return null;
  }
  
  const sourceLanguage = detectLanguage(cleanText);
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
