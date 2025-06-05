
import { useEffect, useRef } from 'react';

interface SmartTextSelectorProps {
  onTextSelect: (text: string, position: { x: number; y: number }) => void;
  onSelectionClear: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const SmartTextSelector = ({ onTextSelect, onSelectionClear, textareaRef }: SmartTextSelectorProps) => {
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const selection = window.getSelection();
        const textarea = textareaRef.current;
        
        if (!selection || !textarea || selection.rangeCount === 0) {
          onSelectionClear();
          return;
        }

        const selectedText = selection.toString().trim();
        if (!selectedText) {
          onSelectionClear();
          return;
        }

        // Check if selection is within our textarea
        const range = selection.getRangeAt(0);
        if (!textarea.contains(range.commonAncestorContainer)) {
          onSelectionClear();
          return;
        }

        const rect = range.getBoundingClientRect();
        onTextSelect(selectedText, {
          x: rect.left + rect.width / 2,
          y: rect.top
        });
      }, 100);
    };

    const handleDoubleClick = (event: MouseEvent) => {
      const textarea = textareaRef.current;
      if (!textarea || event.target !== textarea) return;

      // Auto-select word or phrase on double click
      const selection = window.getSelection();
      if (!selection) return;

      // Expand selection to include surrounding words for better phrase detection
      const range = selection.getRangeAt(0);
      const textContent = textarea.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Find word/phrase boundaries
      let expandedStart = start;
      let expandedEnd = end;

      // Expand backwards to find start of phrase
      while (expandedStart > 0 && /[a-zA-ZÀ-ÿ\s]/.test(textContent[expandedStart - 1])) {
        expandedStart--;
        if (textContent[expandedStart] === '.' || textContent[expandedStart] === '!' || textContent[expandedStart] === '?') {
          expandedStart++;
          break;
        }
      }

      // Expand forwards to find end of phrase
      while (expandedEnd < textContent.length && /[a-zA-ZÀ-ÿ\s]/.test(textContent[expandedEnd])) {
        expandedEnd++;
        if (textContent[expandedEnd] === '.' || textContent[expandedEnd] === '!' || textContent[expandedEnd] === '?') {
          break;
        }
      }

      const expandedText = textContent.substring(expandedStart, expandedEnd).trim();
      
      // Set the expanded selection
      textarea.setSelectionRange(expandedStart, expandedEnd);
      
      if (expandedText) {
        const rect = textarea.getBoundingClientRect();
        const lineHeight = 24; // Approximate line height
        const charsPerLine = Math.floor(textarea.clientWidth / 8); // Approximate chars per line
        const lineNumber = Math.floor(expandedStart / charsPerLine);
        
        onTextSelect(expandedText, {
          x: rect.left + (expandedStart % charsPerLine) * 8,
          y: rect.top + lineNumber * lineHeight
        });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Auto-select on Ctrl+Click or Alt+Click equivalent with keyboard
      if ((event.ctrlKey || event.altKey) && event.key === ' ') {
        handleDoubleClick(event as any);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('dblclick', handleDoubleClick);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('dblclick', handleDoubleClick);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onTextSelect, onSelectionClear, textareaRef]);

  return null; // This is a logic-only component
};

export default SmartTextSelector;
