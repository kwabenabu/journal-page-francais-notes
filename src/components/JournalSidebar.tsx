
import { JournalEntry } from "../services/journalService";
import { useLanguage } from "../contexts/LanguageContext";

interface JournalSidebarProps {
  entries: JournalEntry[];
  currentEntry: JournalEntry | null;
  onLoadEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

const JournalSidebar = ({ entries, currentEntry, onLoadEntry, onDeleteEntry }: JournalSidebarProps) => {
  const { t } = useLanguage();

  return (
    <div className="w-1/3 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('journal.myEntries')}</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
              currentEntry?.id === entry.id
                ? "bg-amber-50 border-amber-200"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onLoadEntry(entry)}
          >
            <div className="text-sm text-gray-600 mb-1">
              {new Date(entry.updated_at).toLocaleDateString('fr-FR')}
            </div>
            <div className="text-sm text-gray-800 line-clamp-2">
              {entry.content.substring(0, 100)}...
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteEntry(entry.id);
              }}
              className="text-red-500 hover:text-red-700 text-xs mt-2"
            >
              {t('journal.delete')}
            </button>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            {t('journal.noEntries')}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalSidebar;
