
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";

interface KeyboardShortcutsProps {
  content: string;
  saveEntry: () => void;
  createNewEntry: () => void;
  translateSelectedText: () => Promise<boolean> | boolean;
  setShowCommandPalette: (show: boolean) => void;
  showCommandPalette: boolean;
}

export const useWritingKeyboardShortcuts = ({
  content,
  saveEntry,
  createNewEntry,
  translateSelectedText,
  setShowCommandPalette,
  showCommandPalette
}: KeyboardShortcutsProps) => {
  const shortcuts = [
    {
      key: 's',
      ctrlKey: true,
      action: () => {
        if (content.trim()) {
          saveEntry();
          if ((window as any).announceToScreenReader) {
            (window as any).announceToScreenReader('Entry saved');
          }
        }
      },
      description: 'Save entry'
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => {
        createNewEntry();
        if ((window as any).announceToScreenReader) {
          (window as any).announceToScreenReader('New entry created');
        }
      },
      description: 'New entry'
    },
    {
      key: 't',
      ctrlKey: true,
      action: () => {
        translateSelectedText();
        if ((window as any).announceToScreenReader) {
          (window as any).announceToScreenReader('Translation requested');
        }
      },
      description: 'Translate selected text'
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => setShowCommandPalette(true),
      description: 'Open command palette'
    },
    {
      key: 'Escape',
      action: () => {
        if (showCommandPalette) {
          setShowCommandPalette(false);
        }
      },
      description: 'Close dialogs'
    }
  ];

  useKeyboardShortcuts(shortcuts);
  
  return shortcuts;
};
