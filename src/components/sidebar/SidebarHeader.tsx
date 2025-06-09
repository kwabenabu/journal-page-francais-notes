
import { Plus } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { EnhancedButton } from "../ui/enhanced-button";

interface SidebarHeaderProps {
  onNewEntry: () => void;
}

const SidebarHeader = ({ onNewEntry }: SidebarHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/60">
      <div className="animate-fade-in">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-1 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
          {t('journal.myEntries')}
        </h2>
        <p className="text-sm text-gray-600 font-medium">Manage your writing journey</p>
      </div>
      <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <EnhancedButton
          onClick={onNewEntry}
          ripple
          glow
          shimmer
          className="
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
            hover:rotate-1
            group
          "
          title="Create New Entry"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-medium">New</span>
        </EnhancedButton>
      </div>
    </div>
  );
};

export default SidebarHeader;
