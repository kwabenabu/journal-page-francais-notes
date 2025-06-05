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
    if (!textarea) {
      console.log("No textarea found");
      return false;
    }

    // First check if there's a text selection in the window
    const selection = window.getSelection();
    let selectedText = '';
    let selectionRect: DOMRect | null = null;

    if (selection && selection.rangeCount > 0) {
      selectedText = selection.toString().trim();
      if (selectedText && selectedText.length >= 2) {
        const range = selection.getRangeAt(0);
        if (textarea.contains(range.commonAncestorContainer)) {
          selectionRect = range.getBoundingClientRect();
        }
      }
    }

    // If no window selection, check textarea selection
    if (!selectedText) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start !== end) {
        selectedText = textarea.value.substring(start, end).trim();
        if (selectedText && selectedText.length >= 2) {
          // Calculate position for textarea selection
          const rect = textarea.getBoundingClientRect();
          const lineHeight = 24;
          const charsPerLine = Math.floor(textarea.clientWidth / 8);
          const lineNumber = Math.floor(start / charsPerLine);
          
          selectionRect = new DOMRect(
            rect.left + (start % charsPerLine) * 8,
            rect.top + lineNumber * lineHeight,
            (end - start) * 8,
            lineHeight
          );
        }
      }
    }

    if (!selectedText || selectedText.length < 2) {
      console.log("No text selected or text too short:", selectedText);
      // Clear any existing translation
      setTranslation(null);
      return false;
    }

    console.log("Translating selected text:", selectedText);

    const translationResult = await translateWord(selectedText);
    if (translationResult && selectionRect) {
      setTranslation({
        word: selectedText,
        translation: translationResult.translatedText,
        sourceLanguage: translationResult.sourceLanguage,
        targetLanguage: translationResult.targetLanguage,
        position: {
          x: selectionRect.left + selectionRect.width / 2,
          y: selectionRect.top
        }
      });
      console.log("Translation successful:", translationResult);
      return true;
    } else {
      console.log("Translation failed or no position available");
      setTranslation(null);
      return false;
    }
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
        console.log("Ctrl+T pressed, attempting translation");
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
