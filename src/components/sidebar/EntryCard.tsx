import { JournalEntry } from "../../services/journalService";
import { useLanguage } from "../../contexts/LanguageContext";
import { Star, Trash2, Edit } from "lucide-react";
import { Badge } from "../ui/badge";

interface EntryCardProps {
  entry: JournalEntry;
  index: number;
  isDraft?: boolean;
  isSelected: boolean;
  onLoadEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

const EntryCard = ({ 
  entry, 
  index, 
  isDraft = false, 
  isSelected, 
  onLoadEntry, 
  onDeleteEntry 
}: EntryCardProps) => {
  const { t } = useLanguage();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-100 border-emerald-200";
    if (score >= 60) return "text-amber-700 bg-amber-100 border-amber-200";
    return "text-rose-700 bg-rose-100 border-rose-200";
  };

  return (
    <div
      className={`
        relative
        p-6 
        rounded-2xl 
        cursor-pointer 
        transition-all 
        duration-500
        min-h-[180px]
        animate-fade-in
        group
        border-2
        shadow-lg
        hover:shadow-2xl
        hover:scale-[1.02]
        focus:outline-none
        focus:ring-4
        focus:ring-blue-500/30
        focus:ring-offset-2
        transform-gpu
        ${
          isSelected
            ? "bg-gradient-to-br from-blue-100/90 to-indigo-100/90 border-blue-400/70 shadow-xl ring-2 ring-blue-300/50 scale-[1.02]"
            : "bg-white/90 border-gray-200/60 hover:bg-gradient-to-br hover:from-white hover:to-gray-50/80 hover:border-gray-300/70"
        }
        ${isDraft ? "border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50/90 to-amber-50/90" : ""}
        backdrop-blur-sm
      `}
      onClick={() => onLoadEntry(entry)}
      tabIndex={0}
      role="button"
      style={{ animationDelay: `${index * 100}ms` }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onLoadEntry(entry);
        }
      }}
    >
      {/* Gradient overlay for visual depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-700 font-semibold bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/70 shadow-sm">
              {new Date(entry.updated_at).toLocaleDateString('fr-FR')}
            </div>
            {isDraft && (
              <div className="flex items-center space-x-1 text-orange-700 border border-orange-300/70 bg-orange-100/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm">
                <Edit className="w-3 h-3" />
                <span className="text-xs font-bold">Draft</span>
              </div>
            )}
          </div>
          {entry.french_accuracy_score !== null && entry.french_accuracy_score !== undefined && (
            <div className={`px-4 py-2 rounded-xl text-xs font-bold border-2 flex items-center space-x-2 backdrop-blur-sm shadow-md ${getScoreColor(entry.french_accuracy_score)}`}>
              <Star className="w-4 h-4" />
              <span className="font-bold">{entry.french_accuracy_score}</span>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-800 mb-6 leading-relaxed line-clamp-3 group-hover:text-gray-900 transition-colors duration-300 font-medium">
          {entry.content.length > 120 ? `${entry.content.substring(0, 120)}...` : entry.content}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600 bg-gray-100/90 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/60 font-medium shadow-sm">
            {entry.content.length} characters
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteEntry(entry.id);
            }}
            className="
              text-rose-600 
              hover:text-white
              hover:bg-gradient-to-r
              hover:from-rose-500
              hover:to-rose-600
              focus:text-white
              focus:bg-gradient-to-r
              focus:from-rose-500
              focus:to-rose-600
              text-xs 
              transition-all
              duration-300
              px-4
              py-2
              rounded-xl
              border-2
              border-rose-200/70
              hover:border-rose-500
              focus:border-rose-500
              focus:outline-none
              focus:ring-2
              focus:ring-rose-500/30
              focus:ring-offset-1
              flex
              items-center
              space-x-2
              backdrop-blur-sm
              bg-white/90
              hover:shadow-lg
              hover:scale-105
              active:scale-95
              font-bold
              shadow-md
            "
          >
            <Trash2 className="w-3 h-3" />
            <span>{t('journal.delete')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryCard;
