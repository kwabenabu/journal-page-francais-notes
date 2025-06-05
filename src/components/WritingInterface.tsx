
import { useState, useRef, useEffect } from "react";
import { translateWord } from "../services/translationService";
import TranslationTooltip from "./TranslationTooltip";

const WritingInterface = () => {
  const [content, setContent] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [translation, setTranslation] = useState<{
    word: string;
    translation: string;
    sourceLanguage: 'en' | 'fr';
    targetLanguage: 'en' | 'fr';
    position: { x: number; y: number };
  } | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setTranslation(null);
        return;
      }

      const selectedText = selection.toString().trim();
      if (!selectedText || selectedText.includes(' ')) {
        setTranslation(null);
        return;
      }

      // Check if selection is within our textarea
      const range = selection.getRangeAt(0);
      const textarea = textareaRef.current;
      if (!textarea || !textarea.contains(range.commonAncestorContainer)) {
        setTranslation(null);
        return;
      }

      const translationResult = translateWord(selectedText);
      if (translationResult) {
        const rect = range.getBoundingClientRect();
        setTranslation({
          word: selectedText,
          translation: translationResult.translatedText,
          sourceLanguage: translationResult.sourceLanguage,
          targetLanguage: translationResult.targetLanguage,
          position: {
            x: rect.left + rect.width / 2,
            y: rect.top
          }
        });
      } else {
        setTranslation(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const handleCloseTooltip = () => {
    setTranslation(null);
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-serif font-bold text-gray-800 mb-6 text-center">
            Journal Bilingue
          </h1>
          
          <p className="text-sm text-gray-600 mb-6 text-center">
            Écrivez en français ou en anglais. Surlignez un mot pour voir sa traduction.
          </p>
          
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Commencez à écrire votre entrée de journal ici... Start writing your journal entry here..."
            className="w-full h-96 p-6 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 leading-relaxed"
            style={{ fontFamily: 'inherit' }}
          />
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            {content.length} caractères
          </div>
        </div>
      </div>

      {translation && (
        <TranslationTooltip
          word={translation.word}
          translation={translation.translation}
          sourceLanguage={translation.sourceLanguage}
          targetLanguage={translation.targetLanguage}
          position={translation.position}
          onClose={handleCloseTooltip}
        />
      )}
    </div>
  );
};

export default WritingInterface;
