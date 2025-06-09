
import { translateWord as staticTranslateWord } from './translationService';
import { createClient } from '@supabase/supabase-js';

interface TranslationResult {
  translatedText: string;
  sourceLanguage: 'en' | 'fr';
  targetLanguage: 'en' | 'fr';
}

// Enhanced language detection
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

// LibreTranslate API call using Supabase Edge Function
async function libreTranslateAPI(text: string, sourceLang: string, targetLang: string): Promise<string | null> {
  try {
    // Get Supabase client - using the same config as the main app
    const supabaseUrl = "https://pyffplgkrwdgdczjuhyw.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZmZwbGdrcndkZ2Rjemp1aHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5OTg1ODAsImV4cCI6MjA2NDU3NDU4MH0.9BJKjuswhdzkircoF5lzwcjcCtqpOnr-c3rPXTKRdms";
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('Calling LibreTranslate via edge function...');
    
    const { data, error } = await supabase.functions.invoke('libre-translate', {
      body: {
        text,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang
      }
    });
    
    if (error) {
      console.error('LibreTranslate edge function error:', error);
      return null;
    }
    
    if (data && data.translatedText) {
      console.log('LibreTranslate success:', data.translatedText);
      return data.translatedText;
    }
    
    return null;
  } catch (error) {
    console.error('LibreTranslate API error:', error);
    return null;
  }
}

// Enhanced phrase-aware translation with LibreTranslate fallback
export async function translateTextSmart(text: string): Promise<TranslationResult | null> {
  const cleanText = text.toLowerCase()
    .replace(/[.,!?;:"'()]/g, '')
    .trim();
  
  if (!cleanText || cleanText.length < 1) return null;
  
  console.log('Starting translation for:', cleanText);
  
  // First try static translation (fastest)
  const staticResult = staticTranslateWord(text);
  if (staticResult) {
    console.log('Found in static dictionary:', staticResult);
    return staticResult;
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
    const sourceLanguage = enhancedDetectLanguage(cleanText);
    const targetLanguage = sourceLanguage === 'en' ? 'fr' : 'en';
    console.log('Found in enhanced dictionary:', enhancedTranslation);
    return {
      translatedText: enhancedTranslation[targetLanguage],
      sourceLanguage,
      targetLanguage
    };
  }
  
  // Try LibreTranslate API for unknown words/phrases
  const sourceLanguage = enhancedDetectLanguage(cleanText);
  const targetLanguage = sourceLanguage === 'en' ? 'fr' : 'en';
  
  console.log('Trying LibreTranslate API...');
  const apiTranslation = await libreTranslateAPI(text, sourceLanguage, targetLanguage);
  if (apiTranslation) {
    console.log('LibreTranslate API success:', apiTranslation);
    return {
      translatedText: apiTranslation,
      sourceLanguage,
      targetLanguage
    };
  }
  
  console.log('No translation found for:', cleanText);
  return null;
}

// Function specifically for translating longer text like evaluation feedback
export async function translateLongText(text: string, targetLanguage: 'en' | 'fr'): Promise<string | null> {
  if (!text || text.trim().length === 0) return null;
  
  const sourceLanguage = enhancedDetectLanguage(text);
  if (sourceLanguage === targetLanguage) {
    return text; // Already in target language
  }
  
  console.log('Translating long text:', text.substring(0, 50) + '...');
  
  const apiTranslation = await libreTranslateAPI(text, sourceLanguage, targetLanguage);
  if (apiTranslation) {
    console.log('Long text translation success');
    return apiTranslation;
  }
  
  console.log('Long text translation failed');
  return null;
}

// Export the enhanced function as the main translation function
export { translateTextSmart as translateWord };
