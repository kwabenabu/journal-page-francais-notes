
import { useEffect, useRef, useCallback } from 'react';
import { journalService } from '../services/journalService';
import { localStorageService } from '../services/localStorageService';

interface UseAutoSaveOptions {
  content: string;
  entryId: string | null;
  isEnabled: boolean;
  onAutoSave?: (serverId: string) => void;
  onError?: (error: any) => void;
}

export const useAutoSave = ({
  content,
  entryId,
  isEnabled,
  onAutoSave,
  onError
}: UseAutoSaveOptions) => {
  const lastSavedContentRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const performSave = useCallback(async () => {
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
      console.log('Saving draft to server...', { entryId, contentLength: content.length });
      
      const { data, error } = await journalService.autoSaveDraft(entryId, content);
      
      if (error) {
        console.error('Save failed:', error);
        onError?.(error);
      } else if (data?.id) {
        console.log('Save successful:', data.id);
        lastSavedContentRef.current = content;
        
        // Update local storage with server ID
        localStorageService.saveDraft(content, data.id);
        onAutoSave?.(data.id);
      }
    } catch (error) {
      console.error('Save error:', error);
      onError?.(error);
    } finally {
      isSavingRef.current = false;
    }
  }, [content, entryId, isEnabled, onAutoSave, onError]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (content.trim().length > 0 && content !== lastSavedContentRef.current) {
        // Save to local storage immediately when leaving
        localStorageService.saveDraft(content, entryId || undefined);
        
        // Try to save to server (this may not complete due to page unload)
        if (content.trim().length >= 10) {
          performSave();
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [content, entryId, performSave]);

  // Manual save function for when leaving the page/component
  const saveOnNavigate = useCallback(() => {
    if (content.trim().length > 0 && content !== lastSavedContentRef.current) {
      console.log('Saving draft on navigate...', { contentLength: content.length });
      localStorageService.saveDraft(content, entryId || undefined);
      if (content.trim().length >= 10) {
        performSave();
      }
    }
  }, [content, entryId, performSave]);

  // Manual save function
  const manualSave = useCallback(() => {
    performSave();
  }, [performSave]);

  return {
    manualSave,
    saveOnNavigate,
    isSaving: isSavingRef.current
  };
};
