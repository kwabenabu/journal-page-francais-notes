
import { FileText, Edit } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface EmptyStateProps {
  isDraft?: boolean;
}

const EmptyState = ({ isDraft = false }: EmptyStateProps) => {
  const { t } = useLanguage();

  return (
    <div className="text-gray-500 text-center py-16 animate-fade-in">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
        {isDraft ? <Edit className="w-10 h-10 text-gray-400" /> : <FileText className="w-10 h-10 text-gray-400" />}
      </div>
      <p className="text-xl font-serif font-bold text-gray-700 mb-2">
        {isDraft ? "No drafts found" : t('journal.noEntries')}
      </p>
      <p className="text-sm text-gray-500 max-w-xs mx-auto">
        {isDraft 
          ? "Your draft entries will appear here as you write" 
          : "Start writing your first entry to see it here!"
        }
      </p>
    </div>
  );
};

export default EmptyState;
