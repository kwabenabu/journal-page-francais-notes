
import { useEffect, useRef } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[], enabled = true) => {
  const shortcutsRef = useRef(shortcuts);
  
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused = activeElement instanceof HTMLInputElement || 
                           activeElement instanceof HTMLTextAreaElement ||
                           activeElement?.getAttribute('contenteditable') === 'true';

      shortcutsRef.current.forEach(shortcut => {
        const matches = 
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!event.ctrlKey === !!shortcut.ctrlKey &&
          !!event.altKey === !!shortcut.altKey &&
          !!event.shiftKey === !!shortcut.shiftKey &&
          !!event.metaKey === !!shortcut.metaKey;

        if (matches) {
          // Prevent default shortcuts when input is focused, except for specific allowed ones
          const allowedInInput = ['s', 't', '/']; // Save, Translate, Search
          if (isInputFocused && !allowedInInput.includes(shortcut.key.toLowerCase())) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
          shortcut.action();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  return shortcutsRef.current;
};

export const formatShortcut = (shortcut: KeyboardShortcut): string => {
  const parts = [];
  if (shortcut.ctrlKey || shortcut.metaKey) parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
  if (shortcut.altKey) parts.push(navigator.platform.includes('Mac') ? '⌥' : 'Alt');
  if (shortcut.shiftKey) parts.push('⇧');
  parts.push(shortcut.key.toUpperCase());
  return parts.join(navigator.platform.includes('Mac') ? '' : '+');
};
