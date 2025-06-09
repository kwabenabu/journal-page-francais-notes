
import { useState, useEffect } from "react";
import { journalService, JournalEntry } from "../services/journalService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useJournal = () => {
  const [content, setContent] = useState("");
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Wait for auth to load
    
    if (!user) {
      console.log("No user found, redirecting to auth");
      navigate("/auth");
      return;
    }
    
    console.log("User authenticated, loading entries for:", user.email);
    loadEntries();
  }, [user, loading, navigate]);

  const loadEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await journalService.getEntries();
      if (error) {
        console.error("Error loading entries:", error);
        setError("Failed to load journal entries");
      } else if (data) {
        console.log("Loaded entries:", data.length);
        setEntries(data);
        setError(null);
      }
    } catch (err) {
      console.error("Unexpected error loading entries:", err);
      setError("Failed to load journal entries");
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
      if (currentEntry) {
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
        // Update the entry with the new review data
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

  const createNewEntry = () => {
    setContent("");
    setCurrentEntry(null);
    setError(null);
  };

  const loadEntry = (entry: JournalEntry) => {
    setContent(entry.content);
    setCurrentEntry(entry);
    setError(null);
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
        if (currentEntry?.id === id) {
          setContent("");
          setCurrentEntry(null);
        }
        console.log("Entry deleted successfully");
      }
    } catch (error) {
      console.error("Unexpected error deleting entry:", error);
      setError("Failed to delete entry");
    }
  };

  return {
    content,
    setContent,
    currentEntry,
    entries,
    saving,
    lastSaved,
    reviewing,
    error,
    saveEntry,
    createNewEntry,
    loadEntry,
    deleteEntry,
    requestFrenchReview
  };
};
