
interface TranslationResult {
  translatedText: string;
  sourceLanguage: 'en' | 'fr';
  targetLanguage: 'en' | 'fr';
}

// Expanded translation dictionary for words, phrases, and common sentences
const translations: Record<string, { en: string; fr: string }> = {
  // Single words - Basic
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
  'happy': { en: 'happy', fr: 'heureux' },
  'heureux': { en: 'happy', fr: 'heureux' },
  'sad': { en: 'sad', fr: 'triste' },
  'triste': { en: 'sad', fr: 'triste' },
  'big': { en: 'big', fr: 'grand' },
  'grand': { en: 'big', fr: 'grand' },
  'small': { en: 'small', fr: 'petit' },
  'petit': { en: 'small', fr: 'petit' },
  
  // Additional common words
  'wonder': { en: 'wonder', fr: 'se demander' },
  'demander': { en: 'ask/wonder', fr: 'demander' },
  'know': { en: 'know', fr: 'savoir' },
  'savoir': { en: 'know', fr: 'savoir' },
  'see': { en: 'see', fr: 'voir' },
  'voir': { en: 'see', fr: 'voir' },
  'come': { en: 'come', fr: 'venir' },
  'venir': { en: 'come', fr: 'venir' },
  'go': { en: 'go', fr: 'aller' },
  'aller': { en: 'go', fr: 'aller' },
  'want': { en: 'want', fr: 'vouloir' },
  'vouloir': { en: 'want', fr: 'vouloir' },
  'need': { en: 'need', fr: 'avoir besoin' },
  'besoin': { en: 'need', fr: 'besoin' },
  'like': { en: 'like', fr: 'aimer' },
  'aimer': { en: 'like/love', fr: 'aimer' },
  'have': { en: 'have', fr: 'avoir' },
  'avoir': { en: 'have', fr: 'avoir' },
  'be': { en: 'be', fr: 'être' },
  'être': { en: 'be', fr: 'être' },
  'do': { en: 'do', fr: 'faire' },
  'faire': { en: 'do/make', fr: 'faire' },
  'make': { en: 'make', fr: 'faire' },
  'get': { en: 'get', fr: 'obtenir' },
  'obtenir': { en: 'get', fr: 'obtenir' },
  'give': { en: 'give', fr: 'donner' },
  'donner': { en: 'give', fr: 'donner' },
  'take': { en: 'take', fr: 'prendre' },
  'prendre': { en: 'take', fr: 'prendre' },
  'find': { en: 'find', fr: 'trouver' },
  'trouver': { en: 'find', fr: 'trouver' },
  'use': { en: 'use', fr: 'utiliser' },
  'utiliser': { en: 'use', fr: 'utiliser' },
  'feel': { en: 'feel', fr: 'sentir' },
  'sentir': { en: 'feel', fr: 'sentir' },
  'look': { en: 'look', fr: 'regarder' },
  'regarder': { en: 'look', fr: 'regarder' },
  'speak': { en: 'speak', fr: 'parler' },
  'parler': { en: 'speak', fr: 'parler' },
  'listen': { en: 'listen', fr: 'écouter' },
  'écouter': { en: 'listen', fr: 'écouter' },
  'understand': { en: 'understand', fr: 'comprendre' },
  'comprendre': { en: 'understand', fr: 'comprendre' },
  'learn': { en: 'learn', fr: 'apprendre' },
  'apprendre': { en: 'learn', fr: 'apprendre' },
  'teach': { en: 'teach', fr: 'enseigner' },
  'enseigner': { en: 'teach', fr: 'enseigner' },
  'help': { en: 'help', fr: 'aider' },
  'aider': { en: 'help', fr: 'aider' },
  'walk': { en: 'walk', fr: 'marcher' },
  'marcher': { en: 'walk', fr: 'marcher' },
  'run': { en: 'run', fr: 'courir' },
  'courir': { en: 'run', fr: 'courir' },
  'eat': { en: 'eat', fr: 'manger' },
  'manger': { en: 'eat', fr: 'manger' },
  'drink': { en: 'drink', fr: 'boire' },
  'boire': { en: 'drink', fr: 'boire' },
  'sleep': { en: 'sleep', fr: 'dormir' },
  'dormir': { en: 'sleep', fr: 'dormir' },
  'wake': { en: 'wake', fr: 'réveiller' },
  'réveiller': { en: 'wake', fr: 'réveiller' },
  'live': { en: 'live', fr: 'vivre' },
  'vivre': { en: 'live', fr: 'vivre' },
  'die': { en: 'die', fr: 'mourir' },
  'mourir': { en: 'die', fr: 'mourir' },
  'buy': { en: 'buy', fr: 'acheter' },
  'acheter': { en: 'buy', fr: 'acheter' },
  'sell': { en: 'sell', fr: 'vendre' },
  'vendre': { en: 'sell', fr: 'vendre' },
  'open': { en: 'open', fr: 'ouvrir' },
  'ouvrir': { en: 'open', fr: 'ouvrir' },
  'close': { en: 'close', fr: 'fermer' },
  'fermer': { en: 'close', fr: 'fermer' },
  'start': { en: 'start', fr: 'commencer' },
  'commencer': { en: 'start', fr: 'commencer' },
  'stop': { en: 'stop', fr: 'arrêter' },
  'arrêter': { en: 'stop', fr: 'arrêter' },
  'finish': { en: 'finish', fr: 'finir' },
  'finir': { en: 'finish', fr: 'finir' },
  'continue': { en: 'continue', fr: 'continuer' },
  'continuer': { en: 'continue', fr: 'continuer' },
  'wait': { en: 'wait', fr: 'attendre' },
  'attendre': { en: 'wait', fr: 'attendre' },
  'remember': { en: 'remember', fr: 'se souvenir' },
  'souvenir': { en: 'remember', fr: 'souvenir' },
  'forget': { en: 'forget', fr: 'oublier' },
  'oublier': { en: 'forget', fr: 'oublier' },
  'try': { en: 'try', fr: 'essayer' },
  'essayer': { en: 'try', fr: 'essayer' },
  'hope': { en: 'hope', fr: 'espérer' },
  'espérer': { en: 'hope', fr: 'espérer' },
  'believe': { en: 'believe', fr: 'croire' },
  'croire': { en: 'believe', fr: 'croire' },
  'dream': { en: 'dream', fr: 'rêver' },
  'rêver': { en: 'dream', fr: 'rêver' },
  
  // Colors
  'red': { en: 'red', fr: 'rouge' },
  'rouge': { en: 'red', fr: 'rouge' },
  'blue': { en: 'blue', fr: 'bleu' },
  'bleu': { en: 'blue', fr: 'bleu' },
  'green': { en: 'green', fr: 'vert' },
  'vert': { en: 'green', fr: 'vert' },
  'yellow': { en: 'yellow', fr: 'jaune' },
  'jaune': { en: 'yellow', fr: 'jaune' },
  'black': { en: 'black', fr: 'noir' },
  'noir': { en: 'black', fr: 'noir' },
  'white': { en: 'white', fr: 'blanc' },
  'blanc': { en: 'white', fr: 'blanc' },
  
  // Numbers
  'one': { en: 'one', fr: 'un' },
  'un': { en: 'one', fr: 'un' },
  'two': { en: 'two', fr: 'deux' },
  'deux': { en: 'two', fr: 'deux' },
  'three': { en: 'three', fr: 'trois' },
  'trois': { en: 'three', fr: 'trois' },
  'four': { en: 'four', fr: 'quatre' },
  'quatre': { en: 'four', fr: 'quatre' },
  'five': { en: 'five', fr: 'cinq' },
  'cinq': { en: 'five', fr: 'cinq' },
  
  // Family
  'mother': { en: 'mother', fr: 'mère' },
  'mère': { en: 'mother', fr: 'mère' },
  'father': { en: 'father', fr: 'père' },
  'père': { en: 'father', fr: 'père' },
  'child': { en: 'child', fr: 'enfant' },
  'enfant': { en: 'child', fr: 'enfant' },
  'son': { en: 'son', fr: 'fils' },
  'fils': { en: 'son', fr: 'fils' },
  'daughter': { en: 'daughter', fr: 'fille' },
  'fille': { en: 'daughter', fr: 'fille' },
  'brother': { en: 'brother', fr: 'frère' },
  'frère': { en: 'brother', fr: 'frère' },
  'sister': { en: 'sister', fr: 'sœur' },
  'sœur': { en: 'sister', fr: 'sœur' },
  
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
  'i wonder': { en: 'i wonder', fr: 'je me demande' },
  'je me demande': { en: 'i wonder', fr: 'je me demande' },
  'i think': { en: 'i think', fr: 'je pense' },
  'je pense': { en: 'i think', fr: 'je pense' },
  'i believe': { en: 'i believe', fr: 'je crois' },
  'je crois': { en: 'i believe', fr: 'je crois' },
  'i hope': { en: 'i hope', fr: 'j\'espère' },
  'j\'espère': { en: 'i hope', fr: 'j\'espère' },
  'i want': { en: 'i want', fr: 'je veux' },
  'je veux': { en: 'i want', fr: 'je veux' },
  'i need': { en: 'i need', fr: 'j\'ai besoin' },
  'j\'ai besoin': { en: 'i need', fr: 'j\'ai besoin' },
  'i like': { en: 'i like', fr: 'j\'aime' },
  'j\'aime': { en: 'i like', fr: 'j\'aime' },
  
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
  const frenchWords = ['bonjour', 'bon', 'oui', 'non', 'merci', 'eau', 'nourriture', 'maison', 'amour', 'beau', 'temps', 'jour', 'nuit', 'ami', 'travail', 'école', 'livre', 'écrire', 'lire', 'penser', 'aujourd\'hui', 'demain', 'hier', 'heureux', 'triste', 'grand', 'petit', 'demander', 'savoir', 'voir', 'venir', 'aller', 'vouloir', 'besoin', 'aimer', 'avoir', 'être', 'faire', 'obtenir', 'donner', 'prendre', 'trouver', 'utiliser', 'sentir', 'regarder', 'parler', 'écouter', 'comprendre', 'apprendre', 'enseigner', 'aider', 'marcher', 'courir', 'manger', 'boire', 'dormir', 'réveiller', 'vivre', 'mourir', 'acheter', 'vendre', 'ouvrir', 'fermer', 'commencer', 'arrêter', 'finir', 'continuer', 'attendre', 'souvenir', 'oublier', 'essayer', 'espérer', 'croire', 'rêver'];
  const frenchPhrases = ['comment allez-vous', 'comment ça va', 'merci beaucoup', 'excusez-moi', 'je t\'aime', 'bonsoir', 'bonne nuit', 'à bientôt', 'quelle heure est-il', 'je vais bien', 'comment vous appelez-vous', 'd\'où venez-vous', 'je ne comprends pas', 'parlez-vous anglais', 'je parle français', 'où sont les toilettes', 'je me demande', 'je pense', 'je crois', 'j\'espère', 'je veux', 'j\'ai besoin', 'j\'aime'];
  
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
  
  console.log("Looking up translation for:", cleanText);
  
  // Try exact match first
  let translation = translations[cleanText];
  
  // If no exact match, try to find a partial match for longer phrases
  if (!translation) {
    const matchingKey = Object.keys(translations).find(key => 
      cleanText.includes(key) || key.includes(cleanText)
    );
    if (matchingKey) {
      translation = translations[matchingKey];
      console.log("Found partial match:", matchingKey);
    }
  }
  
  if (!translation) {
    console.log("No translation found for:", cleanText);
    return null;
  }
  
  const sourceLanguage = detectLanguage(cleanText);
  const targetLanguage = sourceLanguage === 'en' ? 'fr' : 'en';
  
  console.log("Translation found:", translation[targetLanguage]);
  
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
