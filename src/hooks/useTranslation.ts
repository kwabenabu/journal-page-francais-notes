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

    let selectedText = '';
    let selectionRect: DOMRect | null = null;

    // First check window selection
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      selectedText = selection.toString().trim();
      console.log("Window selection found:", selectedText);
      
      if (selectedText && selectedText.length >= 1) {
        const range = selection.getRangeAt(0);
        if (textarea.contains(range.commonAncestorContainer)) {
          selectionRect = range.getBoundingClientRect();
          console.log("Selection rect from window:", selectionRect);
        }
      }
    }

    // If no window selection, check textarea selection
    if (!selectedText) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      console.log("Textarea selection start:", start, "end:", end);
      
      if (start !== end) {
        selectedText = textarea.value.substring(start, end).trim();
        console.log("Textarea selection text:", selectedText);
        
        if (selectedText && selectedText.length >= 1) {
          // Get textarea position and calculate selection position
          const textareaRect = textarea.getBoundingClientRect();
          const textBeforeSelection = textarea.value.substring(0, start);
          const lines = textBeforeSelection.split('\n');
          const lineNumber = lines.length - 1;
          const charInLine = lines[lines.length - 1].length;
          
          // Estimate character width and line height
          const charWidth = 8; // approximate
          const lineHeight = 24; // approximate
          const padding = 24; // textarea padding
          
          selectionRect = new DOMRect(
            textareaRect.left + padding + charInLine * charWidth,
            textareaRect.top + padding + lineNumber * lineHeight,
            selectedText.length * charWidth,
            lineHeight
          );
          console.log("Calculated selection rect:", selectionRect);
        }
      }
    }

    if (!selectedText || selectedText.length < 1) {
      console.log("No text selected or text too short:", selectedText);
      setTranslation(null);
      return false;
    }

    console.log("Attempting to translate:", selectedText);

    try {
      const translationResult = await translateWord(selectedText);
      console.log("Translation result:", translationResult);
      
      if (translationResult) {
        // Use a default position if selectionRect is null
        const position = selectionRect ? {
          x: selectionRect.left + selectionRect.width / 2,
          y: selectionRect.top
        } : {
          x: window.innerWidth / 2,
          y: 100
        };
        
        console.log("Using position:", position);
        
        setTranslation({
          word: selectedText,
          translation: translationResult.translatedText,
          sourceLanguage: translationResult.sourceLanguage,
          targetLanguage: translationResult.targetLanguage,
          position
        });
        console.log("Translation successful and state updated");
        return true;
      } else {
        console.log("No translation found for:", selectedText);
        setTranslation(null);
        return false;
      }
    } catch (error) {
      console.error("Translation error:", error);
      setTranslation(null);
      return false;
    }
  }, [textareaRef]);

  const handleTextSelect = async (selectedText: string, position: { x: number; y: number }) => {
    if (!selectedText || selectedText.length < 1) {
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
      
      if (!selectedText || selectedText.length < 1) {
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
