
import { ExternalLink, Volume2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { getGoogleTranslateUrl, getWordReferenceUrl } from "../services/translationService";

interface TranslationTooltipProps {
  word: string;
  translation: string;
  sourceLanguage: 'en' | 'fr';
  targetLanguage: 'en' | 'fr';
  position: { x: number; y: number };
  onClose: () => void;
}

const TranslationTooltip = ({ 
  word, 
  translation, 
  sourceLanguage, 
  targetLanguage, 
  position, 
  onClose 
}: TranslationTooltipProps) => {
  const [copied, setCopied] = useState(false);
  
  const googleUrl = getGoogleTranslateUrl(word, sourceLanguage, targetLanguage);
  const wordRefUrl = getWordReferenceUrl(word, sourceLanguage, targetLanguage);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePlayAudio = () => {
    // Use Web Speech API for text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translation);
      utterance.lang = targetLanguage === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Backdrop to catch clicks */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Tooltip */}
      <div 
        className="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-xl min-w-64 max-w-80 overflow-hidden"
        style={{ 
          left: `${Math.max(10, Math.min(position.x - 128, window.innerWidth - 320))}px`, 
          top: `${Math.max(10, position.y - 120)}px`,
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {sourceLanguage.toUpperCase()} → {targetLanguage.toUpperCase()}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Original and Translation */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">Original:</div>
            <div className="font-medium text-gray-900 mb-3 p-2 bg-gray-50 rounded-lg">
              "{word}"
            </div>
            
            <div className="text-sm text-gray-600 mb-1">Translation:</div>
            <div className="font-medium text-blue-600 text-lg p-2 bg-blue-50 rounded-lg flex items-center justify-between">
              <span>"{translation}"</span>
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={handlePlayAudio}
                  className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                  title="Play pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                  title="Copy translation"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* External Links */}
          <div className="border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-500 mb-2">Learn more:</div>
            <div className="flex flex-col space-y-2">
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-all"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Google Translate</span>
              </a>
              <a
                href={wordRefUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded-lg transition-all"
              >
                <ExternalLink className="w-3 h-3" />
                <span>WordReference Dictionary</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TranslationTooltip;
