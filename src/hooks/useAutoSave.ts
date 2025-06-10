
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
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentDraftIdRef = useRef<string | null>(entryId);

  // Debounced auto-save function - saves after user stops typing for 2 seconds
  const debouncedSave = useCallback(async () => {
    if (!isEnabled || isSavingRef.current || content === lastSavedContentRef.current) {
      return;
    }

    // Always save to local storage immediately
    const localDraftId = localStorageService.saveDraft(content, currentDraftIdRef.current || undefined);

    // Skip server save if content is empty or too short
    if (content.trim().length < 10) {
      return;
    }

    try {
      isSavingRef.current = true;
      console.log('Auto-saving draft to server...', { 
        entryId: currentDraftIdRef.current, 
        contentLength: content.length 
      });
      
      const { data, error } = await journalService.autoSaveDraft(currentDraftIdRef.current, content);
      
      if (error) {
        console.error('Auto-save failed:', error);
        onError?.(error);
      } else if (data?.id) {
        console.log('Auto-save successful:', data.id);
        lastSavedContentRef.current = content;
        
        // Update current draft ID if this is a new draft
        if (!currentDraftIdRef.current) {
          currentDraftIdRef.current = data.id;
        }
        
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
  }, [content, isEnabled, onAutoSave, onError]);

  // Auto-save with debouncing - triggers 2 seconds after user stops typing
  useEffect(() => {
    if (!isEnabled || content === lastSavedContentRef.current) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Save to local storage immediately for instant persistence
    if (content.trim().length > 0) {
      localStorageService.saveDraft(content, currentDraftIdRef.current || undefined);
    }

    // Set new timeout for server save
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave();
    }, 2000); // 2 second delay

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, isEnabled, debouncedSave]);

  // Update current draft ID when entryId changes
  useEffect(() => {
    currentDraftIdRef.current = entryId;
  }, [entryId]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (content.trim().length > 0 && content !== lastSavedContentRef.current) {
        // Save to local storage immediately when leaving
        localStorageService.saveDraft(content, currentDraftIdRef.current || undefined);
        
        // Try to save to server (this may not complete due to page unload)
        if (content.trim().length >= 10) {
          debouncedSave();
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [content, debouncedSave]);

  // Manual save function for when leaving the page/component
  const saveOnNavigate = useCallback(() => {
    if (content.trim().length > 0 && content !== lastSavedContentRef.current) {
      console.log('Saving draft on navigate...', { contentLength: content.length });
      localStorageService.saveDraft(content, currentDraftIdRef.current || undefined);
      if (content.trim().length >= 10) {
        debouncedSave();
      }
    }
  }, [content, debouncedSave]);

  // Force immediate save function
  const manualSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    debouncedSave();
  }, [debouncedSave]);

  return {
    manualSave,
    saveOnNavigate,
    isSaving: isSavingRef.current
  };
};
