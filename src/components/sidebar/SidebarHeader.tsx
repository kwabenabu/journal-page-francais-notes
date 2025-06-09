
import { Plus } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface SidebarHeaderProps {
  onNewEntry: () => void;
}

const SidebarHeader = ({ onNewEntry }: SidebarHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/60">
      <div>
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-1">
          {t('journal.myEntries')}
        </h2>
        <p className="text-sm text-gray-600">Manage your writing journey</p>
      </div>
      <button
        onClick={onNewEntry}
        className="
          interactive-button
          bg-gradient-to-r 
          from-blue-600 
          to-indigo-600 
          hover:from-blue-700 
          hover:to-indigo-700 
          text-white 
          p-3 
          rounded-xl 
          transition-all
          duration-300
          flex 
          items-center 
          space-x-2
          shadow-lg
          hover:shadow-xl
          hover:scale-105
          active:scale-95
          focus:outline-none
          focus:ring-3
          focus:ring-blue-500/30
          focus:ring-offset-2
        "
        title="Create New Entry"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">New</span>
      </button>
    </div>
  );
};

export default SidebarHeader;
