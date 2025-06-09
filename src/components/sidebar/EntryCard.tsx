
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
        glass-card
        p-6 
        rounded-2xl 
        cursor-pointer 
        transition-all 
        duration-500
        hover-lift
        focus:outline-none
        focus:ring-3
        focus:ring-blue-500/30
        focus:ring-offset-2
        min-h-[160px]
        animate-fade-in
        group
        ${
          isSelected
            ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-lg ring-2 ring-blue-200"
            : "hover:bg-gradient-to-br hover:from-white hover:to-gray-50"
        }
        ${isDraft ? "border-l-4 border-l-orange-400 bg-gradient-to-br from-orange-50 to-amber-50" : ""}
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600 font-medium bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200/60">
            {new Date(entry.updated_at).toLocaleDateString('fr-FR')}
          </div>
          {isDraft && (
            <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-100/80 backdrop-blur-sm">
              <Edit className="w-3 h-3 mr-1" />
              Draft
            </Badge>
          )}
        </div>
        {entry.french_accuracy_score !== null && entry.french_accuracy_score !== undefined && (
          <div className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center space-x-2 backdrop-blur-sm ${getScoreColor(entry.french_accuracy_score)}`}>
            <Star className="w-4 h-4" />
            <span className="font-semibold">{entry.french_accuracy_score}</span>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-800 mb-5 leading-relaxed line-clamp-3 group-hover:text-gray-900 transition-colors duration-300">
        {entry.content.length > 150 ? `${entry.content.substring(0, 150)}...` : entry.content}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 bg-gray-100/80 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/50">
          {entry.content.length} characters
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteEntry(entry.id);
          }}
          className="
            interactive-button
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
            border-rose-200
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
            bg-white/80
            hover:shadow-lg
            hover:scale-105
            active:scale-95
          "
        >
          <Trash2 className="w-3 h-3" />
          <span className="font-medium">{t('journal.delete')}</span>
        </button>
      </div>
    </div>
  );
};

export default EntryCard;
