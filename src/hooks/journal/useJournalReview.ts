
import { journalService } from "../../services/journalService";

interface UseJournalReviewProps {
  setReviewing: (reviewing: boolean) => void;
  setError: (error: string | null) => void;
  setEntries: (entries: any) => void;
  currentEntry: any;
  setCurrentEntry: (entry: any) => void;
}

export const useJournalReview = ({
  setReviewing,
  setError,
  setEntries,
  currentEntry,
  setCurrentEntry
}: UseJournalReviewProps) => {
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
        setEntries((prev: any) => prev.map((entry: any) => 
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
    requestFrenchReview,
  };
};
