
import { translateWord as staticTranslateWord } from './translationService';

interface TranslationResult {
  translatedText: string;
  sourceLanguage: 'en' | 'fr';
  targetLanguage: 'en' | 'fr';
}

// Fallback to Google Translate API (would require API key in production)
async function googleTranslateAPI(text: string, sourceLang: string, targetLang: string): Promise<string | null> {
  try {
    // This would be the actual Google Translate API call
    // For now, we'll return null to fall back to static dictionary
    return null;
  } catch (error) {
    console.error('Google Translate API error:', error);
    return null;
  }
}

// Enhanced translation with better language detection
function enhancedDetectLanguage(text: string): 'en' | 'fr' {
  const lowerText = text.toLowerCase().trim();
  
  // French indicators
  const frenchIndicators = [
    // Articles
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'dans',
    // Common French words
    'avec', 'pour', 'sans', 'sur', 'sous', 'qui', 'que', 'dont', 'où',
    'cette', 'ces', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses',
    // Verbs
    'être', 'avoir', 'faire', 'aller', 'dire', 'voir', 'savoir', 'pouvoir',
    'vouloir', 'venir', 'falloir', 'devoir', 'prendre', 'donner', 'mettre'
  ];
  
  // Check for French indicators
  const frenchScore = frenchIndicators.reduce((score, indicator) => {
    return score + (lowerText.includes(indicator) ? 1 : 0);
  }, 0);
  
  // Check for French accented characters
  const accentedChars = /[àâäéèêëîïôöùûüÿç]/g;
  const accentScore = (lowerText.match(accentedChars) || []).length;
  
  // English indicators
  const englishIndicators = [
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'our', 'their',
    'is', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would', 'can', 'could'
  ];
  
  const englishScore = englishIndicators.reduce((score, indicator) => {
    return score + (lowerText.includes(indicator) ? 1 : 0);
  }, 0);
  
  // Decision logic
  if (accentScore > 0) return 'fr';
  if (frenchScore > englishScore) return 'fr';
  return 'en';
}

// Enhanced phrase-aware translation
export async function translateTextSmart(text: string): Promise<TranslationResult | null> {
  const cleanText = text.toLowerCase()
    .replace(/[.,!?;:"'()]/g, '')
    .trim();
  
  if (!cleanText || cleanText.length < 1) return null;
  
  // First try static translation (fastest)
  const staticResult = staticTranslateWord(text);
  if (staticResult) {
    return staticResult;
  }
  
  // Try real-time API translation (would require API key)
  const sourceLanguage = enhancedDetectLanguage(cleanText);
  const targetLanguage = sourceLanguage === 'en' ? 'fr' : 'en';
  
  const apiTranslation = await googleTranslateAPI(cleanText, sourceLanguage, targetLanguage);
  if (apiTranslation) {
    return {
      translatedText: apiTranslation,
      sourceLanguage,
      targetLanguage
    };
  }
  
  // Enhanced fallback for common patterns
  const enhancedTranslations: Record<string, { en: string; fr: string }> = {
    // Common expressions not in the basic dictionary
    'how do you say': { en: 'how do you say', fr: 'comment dit-on' },
    'comment dit-on': { en: 'how do you say', fr: 'comment dit-on' },
    'i would like': { en: 'i would like', fr: 'je voudrais' },
    'je voudrais': { en: 'i would like', fr: 'je voudrais' },
    'could you help me': { en: 'could you help me', fr: 'pourriez-vous m\'aider' },
    'pourriez-vous m\'aider': { en: 'could you help me', fr: 'pourriez-vous m\'aider' },
    'i don\'t know': { en: 'i don\'t know', fr: 'je ne sais pas' },
    'je ne sais pas': { en: 'i don\'t know', fr: 'je ne sais pas' },
    'what does this mean': { en: 'what does this mean', fr: 'que veut dire ceci' },
    'que veut dire ceci': { en: 'what does this mean', fr: 'que veut dire ceci' },
  };
  
  const enhancedTranslation = enhancedTranslations[cleanText];
  if (enhancedTranslation) {
    return {
      translatedText: enhancedTranslation[targetLanguage],
      sourceLanguage,
      targetLanguage
    };
  }
  
  return null;
}

// Export the enhanced function as the main translation function
export { translateTextSmart as translateWord };
