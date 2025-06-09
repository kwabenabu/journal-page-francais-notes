
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
    <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('journal.myEntries')}</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`
              p-4 
              rounded-2xl 
              border 
              cursor-pointer 
              transition-all 
              duration-[250ms] 
              ease-[cubic-bezier(.25,.8,.25,1)]
              hover:scale-[1.02] 
              hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] 
              hover:bg-[#F9F9F9]
              focus:scale-[1.02] 
              focus:shadow-[0_4px_20px_rgba(0,0,0,0.1)]
              focus:bg-[#F9F9F9]
              focus:outline-none
              focus:ring-2
              focus:ring-amber-500
              focus:ring-offset-2
              motion-reduce:transition-none
              motion-reduce:hover:transform-none
              motion-reduce:focus:transform-none
              ${
                currentEntry?.id === entry.id
                  ? "bg-amber-50 border-amber-200 shadow-md"
                  : "border-gray-200 bg-white"
              }
            `}
            onClick={() => onLoadEntry(entry)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onLoadEntry(entry);
              }
            }}
          >
            <div className="text-sm text-gray-600 mb-2">
              {new Date(entry.updated_at).toLocaleDateString('fr-FR')}
            </div>
            <div className="text-sm text-gray-800 line-clamp-2 mb-3">
              {entry.content.substring(0, 100)}...
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteEntry(entry.id);
              }}
              className="
                text-red-500 
                hover:text-red-700 
                focus:text-red-700
                text-xs 
                transition-colors 
                duration-[250ms] 
                ease-[cubic-bezier(.25,.8,.25,1)]
                px-2 
                py-1 
                rounded 
                hover:bg-red-50
                focus:bg-red-50
                focus:outline-none
                focus:ring-2
                focus:ring-red-500
                focus:ring-offset-1
              "
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
