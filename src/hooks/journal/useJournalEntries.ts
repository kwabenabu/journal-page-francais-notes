
import { journalService } from "../../services/journalService";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface UseJournalEntriesProps {
  setEntries: (entries: any) => void;
  setDrafts: (drafts: any) => void;
  setError: (error: string | null) => void;
}

export const useJournalEntries = ({ setEntries, setDrafts, setError }: UseJournalEntriesProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await journalService.getEntries();
      if (error) {
        console.error("Error loading entries:", error);
        setError("Failed to load journal entries");
      } else if (data) {
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

  const deleteEntry = async (id: string, currentEntry: any, setCurrentEntry: any, setContent: any, localStorageService: any) => {
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
        setEntries((prev: any) => prev.filter((entry: any) => entry.id !== id));
        setDrafts((prev: any) => prev.filter((entry: any) => entry.id !== id));
        
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

  return {
    loadEntries,
    loadDrafts,
    deleteEntry,
  };
};
