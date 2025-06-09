
import { JournalEntry } from "../services/journalService";
import { useLanguage } from "../contexts/LanguageContext";
import { Star } from "lucide-react";

interface JournalSidebarProps {
  entries: JournalEntry[];
  currentEntry: JournalEntry | null;
  onLoadEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

const JournalSidebar = ({ entries, currentEntry, onLoadEntry, onDeleteEntry }: JournalSidebarProps) => {
  const { t } = useLanguage();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">{t('journal.myEntries')}</h2>
      <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`
              p-4 
              rounded-xl 
              border 
              cursor-pointer 
              transition-all 
              duration-200
              hover:scale-[1.02] 
              hover:shadow-md
              focus:scale-[1.02] 
              focus:shadow-md
              focus:outline-none
              focus:ring-2
              focus:ring-amber-500
              focus:ring-offset-2
              min-h-[120px]
              ${
                currentEntry?.id === entry.id
                  ? "bg-amber-50 border-amber-300 shadow-md"
                  : "border-gray-300 bg-white hover:bg-gray-50"
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
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600 font-medium">
                {new Date(entry.updated_at).toLocaleDateString('fr-FR')}
              </div>
              {entry.french_accuracy_score !== null && entry.french_accuracy_score !== undefined && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getScoreColor(entry.french_accuracy_score)}`}>
                  <Star className="w-3 h-3" />
                  <span>{entry.french_accuracy_score}</span>
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-800 mb-4 leading-relaxed line-clamp-3">
              {entry.content.length > 150 ? `${entry.content.substring(0, 150)}...` : entry.content}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {entry.content.length} characters
              </span>
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
                  duration-200
                  px-2 
                  py-1 
                  rounded 
                  hover:bg-red-50
                  focus:bg-red-50
                  focus:outline-none
                  focus:ring-1
                  focus:ring-red-500
                "
              >
                {t('journal.delete')}
              </button>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-gray-500 text-center py-12">
            <p className="text-lg">{t('journal.noEntries')}</p>
            <p className="text-sm mt-2">Start writing your first entry!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalSidebar;
