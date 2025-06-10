
import { useEffect, useRef, useCallback } from 'react';
import { journalService } from '../services/journalService';
import { localStorageService } from '../services/localStorageService';

interface UseAutoSaveOptions {
  content: string;
  entryId: string | null;
  isEnabled: boolean;
  onAutoSave?: (serverId: string) => void;
  onError?: (error: any) => void;
  saveOnExit?: boolean; // New option to control when to save
}

export const useAutoSave = ({
  content,
  entryId,
  isEnabled,
  onAutoSave,
  onError,
  saveOnExit = false // Default to false for normal auto-save behavior
}: UseAutoSaveOptions) => {
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

  // Set up beforeunload event to save when leaving the page
  useEffect(() => {
    if (!saveOnExit || !isEnabled) {
      return;
    }

    const handleBeforeUnload = () => {
      if (content.trim().length > 0 && content !== lastSavedContentRef.current) {
        // Save to local storage immediately when leaving
        localStorageService.saveDraft(content, entryId || undefined);
        
        // Try to save to server (this may not complete due to page unload)
        if (content.trim().length >= 10) {
          performAutoSave();
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [content, entryId, isEnabled, saveOnExit, performAutoSave]);

  // Manual save function
  const manualSave = useCallback(() => {
    performAutoSave();
  }, [performAutoSave]);

  // Save on exit function for navigation changes
  const saveOnNavigate = useCallback(() => {
    if (content.trim().length > 0 && content !== lastSavedContentRef.current) {
      localStorageService.saveDraft(content, entryId || undefined);
      if (content.trim().length >= 10) {
        performAutoSave();
      }
    }
  }, [content, entryId, performAutoSave]);

  return {
    manualSave,
    saveOnNavigate,
    isSaving: isSavingRef.current
  };
};
