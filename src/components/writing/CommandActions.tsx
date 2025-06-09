
import { Plus, Search, Save, Star, FileText, Settings } from "lucide-react";
import { JournalEntry } from "../../services/journalService";

interface CommandActionsProps {
  createNewEntry: () => void;
  saveEntry: () => void;
  translateSelectedText: () => Promise<boolean> | boolean;
  currentEntry: JournalEntry | null;
  requestFrenchReview: (entryId: string, content: string) => void;
  content: string;
  navigate: (path: string) => void;
}

export const useCommandActions = ({
  createNewEntry,
  saveEntry,
  translateSelectedText,
  currentEntry,
  requestFrenchReview,
  content,
  navigate
}: CommandActionsProps) => {
  return [
    {
      id: 'new-entry',
      title: 'New Entry',
      description: 'Create a new journal entry',
      icon: Plus,
      action: createNewEntry,
      shortcut: 'Ctrl+N',
      group: 'Actions'
    },
    {
      id: 'save-entry',
      title: 'Save Entry',
      description: 'Save current entry',
      icon: Save,
      action: saveEntry,
      shortcut: 'Ctrl+S',
      group: 'Actions'
    },
    {
      id: 'translate',
      title: 'Translate Text',
      description: 'Translate selected text',
      icon: FileText,
      action: translateSelectedText,
      shortcut: 'Ctrl+T',
      group: 'Actions'
    },
    {
      id: 'request-review',
      title: 'Request Review',
      description: 'Get AI feedback on your French',
      icon: Star,
      action: () => currentEntry && requestFrenchReview(currentEntry.id, content),
      shortcut: '',
      group: 'Actions'
    },
    {
      id: 'search',
      title: 'Search Entries',
      description: 'Search through your journal entries',
      icon: Search,
      action: () => {
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      shortcut: '/',
      group: 'Navigation'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Open application settings',
      icon: Settings,
      action: () => navigate('/settings'),
      shortcut: '',
      group: 'Navigation'
    }
  ];
};
