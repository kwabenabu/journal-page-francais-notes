
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
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadEntries();
  }, [user, navigate]);

  const loadEntries = async () => {
    const { data, error } = await journalService.getEntries();
    if (error) {
      console.error("Error loading entries:", error);
    } else if (data) {
      setEntries(data);
    }
  };

  const saveEntry = async () => {
    if (!content.trim()) return;

    setSaving(true);
    try {
      if (currentEntry) {
        const { data, error } = await journalService.updateEntry(currentEntry.id, content);
        if (error) throw error;
        if (data) {
          setCurrentEntry(data);
          setEntries(prev => prev.map(entry => entry.id === data.id ? data : entry));
        }
      } else {
        const { data, error } = await journalService.saveEntry(content);
        if (error) throw error;
        if (data) {
          setCurrentEntry(data);
          setEntries(prev => [data, ...prev]);
        }
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving entry:", error);
    } finally {
      setSaving(false);
    }
  };

  const createNewEntry = () => {
    setContent("");
    setCurrentEntry(null);
  };

  const loadEntry = (entry: JournalEntry) => {
    setContent(entry.content);
    setCurrentEntry(entry);
  };

  const deleteEntry = async (id: string) => {
    const { error } = await journalService.deleteEntry(id);
    if (error) {
      console.error("Error deleting entry:", error);
    } else {
      setEntries(prev => prev.filter(entry => entry.id !== id));
      if (currentEntry?.id === id) {
        setContent("");
        setCurrentEntry(null);
      }
    }
  };

  return {
    content,
    setContent,
    currentEntry,
    entries,
    saving,
    lastSaved,
    saveEntry,
    createNewEntry,
    loadEntry,
    deleteEntry
  };
};
