
import { useEffect } from "react";
import { localStorageService } from "../services/localStorageService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useAutoSave } from "./useAutoSave";
import { useJournalState } from "./journal/useJournalState";
import { useJournalEntries } from "./journal/useJournalEntries";
import { useJournalDrafts } from "./journal/useJournalDrafts";
import { useJournalSearch } from "./journal/useJournalSearch";
import { useJournalReview } from "./journal/useJournalReview";

export const useJournal = () => {
  const state = useJournalState();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract state values for easier access
  const {
    content,
    setContent,
    currentEntry,
    setCurrentEntry,
    entries,
    setEntries,
    drafts,
    setDrafts,
    saving,
    setSaving,
    lastSaved,
    setLastSaved,
    lastAutoSaved,
    setLastAutoSaved,
    reviewing,
    setReviewing,
    error,
    setError,
    isSearching,
    setIsSearching,
    showDraftRecovery,
    setShowDraftRecovery,
    autoSaveEnabled,
    setAutoSaveEnabled,
  } = state;

  // Initialize sub-hooks
  const entriesHook = useJournalEntries({ setEntries, setDrafts, setError });
  const searchHook = useJournalSearch({ setEntries, setError, setIsSearching });
  const reviewHook = useJournalReview({
    setReviewing,
    setError,
    setEntries,
    currentEntry,
    setCurrentEntry
  });

  const draftsHook = useJournalDrafts({
    content,
    setContent,
    currentEntry,
    setCurrentEntry,
    setSaving,
    setLastSaved,
    setError,
    setEntries,
    setDrafts,
    loadEntries: entriesHook.loadEntries,
    loadDrafts: entriesHook.loadDrafts,
    setAutoSaveEnabled,
    setShowDraftRecovery,
    drafts
  });

  // Auto-save functionality - continuously saves while typing with debouncing
  const { manualSave, saveOnNavigate } = useAutoSave({
    content,
    entryId: currentEntry?.id || null,
    isEnabled: autoSaveEnabled && content.trim().length > 0,
    onAutoSave: (serverId) => {
      console.log('Draft auto-saved:', serverId);
      setLastAutoSaved(new Date());
      
      // If this is a new draft (no current entry), create the entry object
      if (!currentEntry?.id && serverId) {
        const newDraft = {
          id: serverId,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: user?.id || "",
          is_draft: true,
          auto_saved_at: new Date().toISOString()
        };
        setCurrentEntry(newDraft);
        
        // Add to drafts list if not already there
        setDrafts(prev => {
          const exists = prev.find(d => d.id === serverId);
          if (exists) {
            return prev.map(d => d.id === serverId ? newDraft : d);
          }
          return [newDraft, ...prev];
        });
      } else if (currentEntry?.is_draft) {
        // Update existing draft in the drafts list
        setDrafts(prev => prev.map(d => 
          d.id === currentEntry.id 
            ? { ...d, content, updated_at: new Date().toISOString(), auto_saved_at: new Date().toISOString() }
            : d
        ));
      }
    },
    onError: (error) => {
      console.error('Auto-save error:', error);
      setError("Auto-save failed, but your work is saved locally");
    }
  });

  // Save when navigating away from the journal page
  useEffect(() => {
    const handleRouteChange = () => {
      if (location.pathname !== '/' && content.trim().length > 0) {
        console.log('Leaving journal page, saving draft...');
        saveOnNavigate();
      }
    };

    // This effect runs when location changes
    return handleRouteChange;
  }, [location, content, saveOnNavigate]);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      console.log("No user found, redirecting to auth");
      navigate("/auth");
      return;
    }
    
    console.log("User authenticated, loading entries for:", user.email);
    entriesHook.loadEntries();
    entriesHook.loadDrafts();
    // Draft recovery popup is now disabled
    // draftsHook.checkForLocalDrafts();
  }, [user, loading, navigate]);

  const deleteEntry = (id: string) => {
    return entriesHook.deleteEntry(id, currentEntry, setCurrentEntry, setContent, localStorageService);
  };

  return {
    content,
    setContent,
    currentEntry,
    entries,
    drafts,
    saving,
    lastSaved,
    lastAutoSaved,
    reviewing,
    error,
    isSearching,
    showDraftRecovery: false, // Always false to disable popup
    autoSaveEnabled,
    saveEntry: draftsHook.saveEntry,
    createNewEntry: draftsHook.createNewEntry,
    loadEntry: draftsHook.loadEntry,
    deleteEntry,
    requestFrenchReview: reviewHook.requestFrenchReview,
    searchEntries: searchHook.searchEntries,
    recoverDraft: draftsHook.recoverDraft,
    setShowDraftRecovery,
    manualSave,
    saveOnNavigate,
    setAutoSaveEnabled
  };
};
