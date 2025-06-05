
import { useState, useEffect, useRef, useCallback } from "react";
import { translateWord } from "../services/realTimeTranslationService";

interface TranslationState {
  word: string;
  translation: string;
  sourceLanguage: 'en' | 'fr';
  targetLanguage: 'en' | 'fr';
  position: { x: number; y: number };
}

export const useTranslation = (textareaRef: React.RefObject<HTMLTextAreaElement>) => {
  const [translation, setTranslation] = useState<TranslationState | null>(null);

  const translateSelectedText = useCallback(async () => {
    const textarea = textareaRef.current;
    if (!textarea) return false;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const selectedText = selection.toString().trim();
    if (!selectedText || selectedText.length < 2) return false;

    const range = selection.getRangeAt(0);
    if (!textarea.contains(range.commonAncestorContainer)) return false;

    const translationResult = await translateWord(selectedText);
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
      return true;
    }
    return false;
  }, [textareaRef]);

  const handleTextSelect = async (selectedText: string, position: { x: number; y: number }) => {
    if (!selectedText || selectedText.length < 2) {
      setTranslation(null);
      return;
    }

    const translationResult = await translateWord(selectedText);
    if (translationResult) {
      setTranslation({
        word: selectedText,
        translation: translationResult.translatedText,
        sourceLanguage: translationResult.sourceLanguage,
        targetLanguage: translationResult.targetLanguage,
        position
      });
    } else {
      setTranslation(null);
    }
  };

  const handleSelectionClear = () => {
    setTranslation(null);
  };

  const handleCloseTooltip = () => {
    setTranslation(null);
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  };

  // Add global keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+T for translation
      if (event.ctrlKey && event.key === 't') {
        event.preventDefault();
        translateSelectedText();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [translateSelectedText]);

  useEffect(() => {
    const handleSelectionChange = async () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setTranslation(null);
        return;
      }

      const selectedText = selection.toString().trim();
      
      if (!selectedText || selectedText.length < 2) {
        setTranslation(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const textarea = textareaRef.current;
      if (!textarea || !textarea.contains(range.commonAncestorContainer)) {
        setTranslation(null);
        return;
      }

      const translationResult = await translateWord(selectedText);
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
  }, [textareaRef]);

  return {
    translation,
    handleTextSelect,
    handleSelectionClear,
    handleCloseTooltip,
    translateSelectedText
  };
};
