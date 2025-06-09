
import { journalService } from "../../services/journalService";
import { useAuth } from "../../contexts/AuthContext";

interface UseJournalSearchProps {
  setEntries: (entries: any) => void;
  setError: (error: string | null) => void;
  setIsSearching: (searching: boolean) => void;
}

export const useJournalSearch = ({ setEntries, setError, setIsSearching }: UseJournalSearchProps) => {
  const { user } = useAuth();

  const searchEntries = async (query: string) => {
    if (!user) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await journalService.searchEntries(query);
      if (error) {
        console.error("Error searching entries:", error);
        setError("Failed to search entries");
      } else if (data) {
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

  return {
    searchEntries,
  };
};
