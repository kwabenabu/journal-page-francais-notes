import { useState, useEffect } from "react";
import { journalService, JournalEntry } from "../services/journalService";
import { localStorageService } from "../services/localStorageService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAutoSave } from "./useAutoSave";

export const useJournal = () => {
  const [content, setContent] = useState("");
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [drafts, setDrafts] = useState<JournalEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [lastAutoSaved, setLastAutoSaved] = useState<Date | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDraftRecovery, setShowDraftRecovery] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Auto-save functionality
  const { manualSave } = useAutoSave({
    content,
    entryId: currentEntry?.id || null,
    isEnabled: autoSaveEnabled && content.trim().length > 0,
    onAutoSave: (serverId) => {
      console.log('Auto-save completed:', serverId);
      setLastAutoSaved(new Date());
      
      // Update current entry with server ID if it's a new draft
      if (!currentEntry?.id && serverId) {
        setCurrentEntry(prev => prev ? { ...prev, id: serverId } : null);
      }
    },
    onError: (error) => {
      console.error('Auto-save error:', error);
      setError("Auto-save failed, but your work is saved locally");
    }
  });

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      console.log("No user found, redirecting to auth");
      navigate("/auth");
      return;
    }
    
    console.log("User authenticated, loading entries for:", user.email);
    loadEntries();
    loadDrafts();
    checkForLocalDrafts();
  }, [user, loading, navigate]);

  const checkForLocalDrafts = () => {
    const localDrafts = localStorageService.getAllDrafts();
    const validDrafts = localDrafts.filter(draft => 
      draft.content.trim().length > 0 && 
      !draft.serverId // Only show drafts that haven't been saved to server
    );
    
    if (validDrafts.length > 0) {
      setShowDraftRecovery(true);
    }
  };

  const loadEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await journalService.getEntries();
      if (error) {
        console.error("Error loading entries:", error);
        setError("Failed to load journal entries");
      } else if (data) {
        // Filter out drafts from main entries
        const publishedEntries = data.filter(entry => !entry.is_draft);
        console.log("Loaded entries:", publishedEntries.length);
        setEntries(publishedEntries);
        setError(null);
      }
    } catch (err) {
      console.error("Unexpected error loading entries:", err);
      setError("Failed to load journal entries");
    }
  };

  const loadDrafts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await journalService.getDrafts();
      if (error) {
        console.error("Error loading drafts:", error);
      } else if (data) {
        console.log("Loaded drafts:", data.length);
        setDrafts(data);
      }
    } catch (err) {
      console.error("Unexpected error loading drafts:", err);
    }
  };

  const searchEntries = async (query: string) => {
    if (!user) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await journalService.searchEntries(query);
      if (error) {
        console.error("Error searching entries:", error);
        setError("Failed to search entries");
      } else if (data) {
        // Filter out drafts from search results
        const publishedEntries = data.filter(entry => !entry.is_draft);
        console.log("Search results:", publishedEntries.length);
        setEntries(publishedEntries);
        setError(null);
      }
    } catch (err) {
      console.error("Unexpected error searching entries:", err);
      setError("Failed to search entries");
    } finally {
      setIsSearching(false);
    }
  };

  const saveEntry = async () => {
    if (!content.trim()) {
      setError("Please enter some content before saving");
      return;
    }

    if (!user) {
      setError("You must be logged in to save entries");
      navigate("/auth");
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      if (currentEntry?.is_draft) {
        // Publish draft
        console.log("Publishing draft:", currentEntry.id);
        const { data: publishResult, error: publishError } = await journalService.publishDraft(currentEntry.id);
        
        if (publishError) {
          console.error("Publish error:", publishError);
          setError("Failed to publish entry: " + (publishError.message || "Unknown error"));
          return;
        }
        
        if (publishResult) {
          // Reload entries to get the published version
          await loadEntries();
          await loadDrafts();
          
          // Clear current draft and local storage
          localStorageService.clearCurrentDraft();
          setCurrentEntry(null);
          setContent("");
          setLastSaved(new Date());
          console.log("Draft published successfully");
        }
      } else if (currentEntry) {
        // Update existing published entry
        console.log("Updating existing entry:", currentEntry.id);
        const { data, error } = await journalService.updateEntry(currentEntry.id, content);
        if (error) {
          console.error("Update error:", error);
          setError("Failed to update entry: " + (error.message || "Unknown error"));
          return;
        }
        if (data) {
          setCurrentEntry(data);
          setEntries(prev => prev.map(entry => entry.id === data.id ? data : entry));
          setLastSaved(new Date());
          console.log("Entry updated successfully");
        }
      } else {
        // Create new published entry
        console.log("Creating new entry");
        const { data, error } = await journalService.saveEntry(content);
        if (error) {
          console.error("Save error:", error);
          setError("Failed to save entry: " + (error.message || "Unknown error"));
          return;
        }
        if (data) {
          setCurrentEntry(data);
          setEntries(prev => [data, ...prev]);
          setLastSaved(new Date());
          localStorageService.clearCurrentDraft();
          console.log("Entry saved successfully");
        }
      }
    } catch (error) {
      console.error("Unexpected error saving entry:", error);
      setError("Failed to save entry");
    } finally {
      setSaving(false);
    }
  };

  const createNewEntry = () => {
    setContent("");
    setCurrentEntry(null);
    setError(null);
    setAutoSaveEnabled(true);
    localStorageService.clearCurrentDraft();
  };

  const loadEntry = (entry: JournalEntry) => {
    setContent(entry.content || "");
    setCurrentEntry(entry);
    setError(null);
    setAutoSaveEnabled(!entry.is_draft); // Disable auto-save for existing drafts initially
    
    // Save to local storage when loading an entry
    localStorageService.saveDraft(entry.content || "", entry.id);
  };

  const recoverDraft = (draftContent: string, serverId?: string) => {
    setContent(draftContent);
    setError(null);
    setAutoSaveEnabled(true);
    
    if (serverId) {
      // If we have a server ID, try to find the corresponding draft
      const serverDraft = drafts.find(d => d.id === serverId);
      if (serverDraft) {
        setCurrentEntry(serverDraft);
      } else {
        // Create a mock entry for the recovered draft
        setCurrentEntry({
          id: serverId,
          content: draftContent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: user?.id || "",
          is_draft: true
        });
      }
    } else {
      setCurrentEntry(null);
    }
    
    setShowDraftRecovery(false);
  };

  const deleteEntry = async (id: string) => {
    if (!user) {
      setError("You must be logged in to delete entries");
      return;
    }

    try {
      const { error } = await journalService.deleteEntry(id);
      if (error) {
        console.error("Error deleting entry:", error);
        setError("Failed to delete entry");
      } else {
        setEntries(prev => prev.filter(entry => entry.id !== id));
        setDrafts(prev => prev.filter(entry => entry.id !== id));
        
        if (currentEntry?.id === id) {
          setContent("");
          setCurrentEntry(null);
          localStorageService.clearCurrentDraft();
        }
        console.log("Entry deleted successfully");
      }
    } catch (error) {
      console.error("Unexpected error deleting entry:", error);
      setError("Failed to delete entry");
    }
  };

  const requestFrenchReview = async (entryId: string, content: string) => {
    setReviewing(true);
    setError(null);
    
    try {
      const { data, error } = await journalService.requestFrenchReview(entryId, content);
      if (error) {
        console.error("Error requesting review:", error);
        setError("Failed to request French review");
        return;
      }
      
      if (data && data.success) {
        const updatedEntry = data.data;
        setEntries(prev => prev.map(entry => 
          entry.id === entryId ? updatedEntry : entry
        ));
        
        if (currentEntry?.id === entryId) {
          setCurrentEntry(updatedEntry);
        }
        console.log("French review completed successfully");
      }
    } catch (error) {
      console.error("Error requesting review:", error);
      setError("Failed to request French review");
    } finally {
      setReviewing(false);
    }
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
    showDraftRecovery,
    autoSaveEnabled,
    saveEntry,
    createNewEntry,
    loadEntry,
    deleteEntry,
    requestFrenchReview,
    searchEntries,
    recoverDraft,
    setShowDraftRecovery,
    manualSave,
    setAutoSaveEnabled
  };
};
