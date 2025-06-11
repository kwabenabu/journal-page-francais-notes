
import { Save } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { EnhancedButton } from "../ui/enhanced-button";
import { LoadingSpinner } from "../ui/loading-spinner";
import TranslateButton from "../TranslateButton";

interface WritingToolbarProps {
  showToolbar: boolean;
  saving: boolean;
  content: string;
  isDraft: boolean;
  onSave: () => void;
  onTranslate: () => Promise<boolean> | boolean;
}

const WritingToolbar = ({
  showToolbar,
  saving,
  content,
  isDraft,
  onSave,
  onTranslate
}: WritingToolbarProps) => {
  const { t } = useLanguage();

  if (!showToolbar) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg animate-slide-in-right">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Writing Mode Active</span>
        </div>
        <div className="flex items-center space-x-3">
          <TranslateButton onTranslate={onTranslate} />
          <EnhancedButton
            onClick={onSave}
            disabled={saving || !content.trim()}
            ripple
            glow
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : isDraft ? 'Publish' : 'Save'}</span>
          </EnhancedButton>
        </div>
      </div>
    </div>
  );
};

export default WritingToolbar;
