
import { useEffect, useRef, useCallback } from 'react';
import { journalService } from '../services/journalService';
import { localStorageService } from '../services/localStorageService';

interface UseAutoSaveOptions {
  content: string;
  entryId: string | null;
  isEnabled: boolean;
  onAutoSave?: (serverId: string) => void;
  onError?: (error: any) => void;
  debounceMs?: number;
}

export const useAutoSave = ({
  content,
  entryId,
  isEnabled,
  onAutoSave,
  onError,
  debounceMs = 2000
}: UseAutoSaveOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedContentRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const performAutoSave = useCallback(async () => {
    if (!isEnabled || isSavingRef.current || content === lastSavedContentRef.current) {
      return;
    }

    // Always save to local storage immediately
    const localDraftId = localStorageService.saveDraft(content, entryId || undefined);

    // Skip server save if content is empty or too short
    if (content.trim().length < 10) {
      return;
    }

    try {
      isSavingRef.current = true;
      console.log('Auto-saving to server...', { entryId, contentLength: content.length });
      
      const { data, error } = await journalService.autoSaveDraft(entryId, content);
      
      if (error) {
        console.error('Auto-save failed:', error);
        onError?.(error);
      } else if (data?.id) {
        console.log('Auto-save successful:', data.id);
        lastSavedContentRef.current = content;
        
        // Update local storage with server ID
        localStorageService.saveDraft(content, data.id);
        onAutoSave?.(data.id);
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      onError?.(error);
    } finally {
      isSavingRef.current = false;
    }
  }, [content, entryId, isEnabled, onAutoSave, onError]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(performAutoSave, debounceMs);

    // Cleanup on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [performAutoSave, debounceMs]);

  // Manual save function
  const manualSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    performAutoSave();
  }, [performAutoSave]);

  return {
    manualSave,
    isSaving: isSavingRef.current
  };
};
