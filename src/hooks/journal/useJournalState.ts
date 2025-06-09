
import { useState } from "react";
import { JournalEntry } from "../../services/journalService";

export const useJournalState = () => {
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

  return {
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
  };
};
