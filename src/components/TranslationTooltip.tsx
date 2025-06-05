
import { ExternalLink } from "lucide-react";
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
  const googleUrl = getGoogleTranslateUrl(word, sourceLanguage, targetLanguage);
  const wordRefUrl = getWordReferenceUrl(word, sourceLanguage, targetLanguage);

  return (
    <div 
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-48"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y - 80}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="text-sm">
        <div className="font-medium text-gray-900 mb-1">
          "{word}" → "{translation}"
        </div>
        <div className="text-xs text-gray-500 mb-3">
          {sourceLanguage.toUpperCase()} → {targetLanguage.toUpperCase()}
        </div>
        
        <div className="flex gap-2">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            <ExternalLink className="w-3 h-3" />
            Google Translate
          </a>
          <a
            href={wordRefUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 underline"
          >
            <ExternalLink className="w-3 h-3" />
            WordReference
          </a>
        </div>
      </div>
      
      <button
        onClick={onClose}
        className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs text-gray-500"
      >
        ×
      </button>
    </div>
  );
};

export default TranslationTooltip;
