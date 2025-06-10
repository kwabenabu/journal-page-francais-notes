
import { journalService } from "../../services/journalService";
import { localStorageService } from "../../services/localStorageService";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface UseJournalDraftsProps {
  content: string;
  setContent: (content: string) => void;
  currentEntry: any;
  setCurrentEntry: (entry: any) => void;
  setSaving: (saving: boolean) => void;
  setLastSaved: (date: Date | null) => void;
  setError: (error: string | null) => void;
  setEntries: (entries: any) => void;
  setDrafts: (drafts: any) => void;
  loadEntries: () => Promise<void>;
  loadDrafts: () => Promise<void>;
  setAutoSaveEnabled: (enabled: boolean) => void;
  setShowDraftRecovery: (show: boolean) => void;
  drafts: any[];
}

export const useJournalDrafts = ({
  content,
  setContent,
  currentEntry,
  setCurrentEntry,
  setSaving,
  setLastSaved,
  setError,
  setEntries,
  setDrafts,
  loadEntries,
  loadDrafts,
  setAutoSaveEnabled,
  setShowDraftRecovery,
  drafts
}: UseJournalDraftsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const checkForLocalDrafts = () => {
    // Draft recovery popup is now disabled
    // Local drafts will still be saved but popup won't show
    console.log('Draft recovery popup disabled');
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
        console.log("Publishing draft:", currentEntry.id);
        const { data: publishResult, error: publishError } = await journalService.publishDraft(currentEntry.id);
        
        if (publishError) {
          console.error("Publish error:", publishError);
          setError("Failed to publish entry: " + (publishError.message || "Unknown error"));
          return;
        }
        
        if (publishResult) {
          await loadEntries();
          await loadDrafts();
          
          localStorageService.clearCurrentDraft();
          setCurrentEntry(null);
          setContent("");
          setLastSaved(new Date());
          console.log("Draft published successfully");
        }
      } else if (currentEntry) {
        console.log("Updating existing entry:", currentEntry.id);
        const { data, error } = await journalService.updateEntry(currentEntry.id, content);
        if (error) {
          console.error("Update error:", error);
          setError("Failed to update entry: " + (error.message || "Unknown error"));
          return;
        }
        if (data) {
          setCurrentEntry(data);
          setEntries((prev: any) => prev.map((entry: any) => entry.id === data.id ? data : entry));
          setLastSaved(new Date());
          console.log("Entry updated successfully");
        }
      } else {
        console.log("Creating new entry");
        const { data, error } = await journalService.saveEntry(content);
        if (error) {
          console.error("Save error:", error);
          setError("Failed to save entry: " + (error.message || "Unknown error"));
          return;
        }
        if (data) {
          setCurrentEntry(data);
          setEntries((prev: any) => [data, ...prev]);
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

  const loadEntry = (entry: any) => {
    setContent(entry.content || "");
    setCurrentEntry(entry);
    setError(null);
    // Enable auto-save for all entries (drafts and published)
    setAutoSaveEnabled(true);
    
    // For drafts, save to local storage so auto-save can continue from this point
    if (entry.is_draft) {
      localStorageService.saveDraft(entry.content || "", entry.id);
    }
  };

  const recoverDraft = (draftContent: string, serverId?: string) => {
    setContent(draftContent);
    setError(null);
    setAutoSaveEnabled(true);
    
    if (serverId) {
      const serverDraft = drafts.find(d => d.id === serverId);
      if (serverDraft) {
        setCurrentEntry(serverDraft);
      } else {
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

  return {
    checkForLocalDrafts,
    saveEntry,
    createNewEntry,
    loadEntry,
    recoverDraft,
  };
};
