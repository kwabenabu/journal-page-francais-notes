
import { Save, Cloud, CloudOff, TrendingUp, Target, Clock } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { JournalEntry } from "../../services/journalService";
import { EnhancedButton } from "../ui/enhanced-button";
import { LoadingSpinner } from "../ui/loading-spinner";
import { ProgressBar } from "../ui/progress-bar";
import TranslateButton from "../TranslateButton";

interface WritingHeaderProps {
  currentEntry: JournalEntry | null;
  saving: boolean;
  lastSaved: Date | null;
  lastAutoSaved?: Date | null;
  autoSaveEnabled: boolean;
  content: string;
  onSave: () => void;
  onTranslate: () => Promise<boolean> | boolean;
  onManualSave?: () => void;
}

const WritingHeader = ({
  currentEntry,
  saving,
  lastSaved,
  lastAutoSaved,
  autoSaveEnabled,
  content,
  onSave,
  onTranslate,
  onManualSave
}: WritingHeaderProps) => {
  const { t } = useLanguage();
  
  const isDraft = currentEntry?.is_draft;
  const hasUnsavedChanges = content !== (currentEntry?.content || "");
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const progressValue = Math.min((wordCount / 300) * 100, 100);

  const getStatusText = () => {
    if (saving) return t('journal.saving');
    if (isDraft) {
      if (lastAutoSaved) {
        return `Draft auto-saved at ${lastAutoSaved.toLocaleTimeString('fr-FR')}`;
      }
      return "Draft (saves when you leave)";
    }
    if (lastSaved) {
      return `${t('journal.savedAt')} ${lastSaved.toLocaleTimeString('fr-FR')}`;
    }
    return "Not saved";
  };

  const getStatusIcon = () => {
    if (saving) return <LoadingSpinner size="sm" className="text-blue-500" />;
    if (autoSaveEnabled && hasUnsavedChanges) return <Cloud className="w-4 h-4 text-blue-500" />;
    if (lastSaved || lastAutoSaved) return <Cloud className="w-4 h-4 text-emerald-500" />;
    return <CloudOff className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="border-b border-white/30 px-8 py-8 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 animate-pulse"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="animate-slide-up">
            <h2 className="text-4xl font-serif font-bold text-gray-800 mb-3 bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              {currentEntry ? 
                (isDraft ? t('journal.editDraft') : t('journal.editEntry')) : 
                'Your French Journey ✨'
              }
            </h2>
            {isDraft && (
              <div className="flex items-center space-x-4 mb-4">
                <p className="text-sm text-blue-800 font-semibold bg-blue-200/80 backdrop-blur-sm px-4 py-2 rounded-full inline-flex items-center space-x-2 animate-fade-in border border-blue-300/50">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span>Draft Mode - Auto-saving as you write</span>
                </p>
                <ProgressBar value={progressValue} className="w-40" gradient animated />
              </div>
            )}
            
            {/* Enhanced Progress Stats */}
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/60 shadow-sm">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-gray-700">{wordCount} words</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/60 shadow-sm">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-700">{Math.round(progressValue)}% to goal</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/60 shadow-sm">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-semibold text-gray-700">{Math.ceil(wordCount / 200)} min read</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center space-x-3 text-sm text-gray-600 bg-white/90 backdrop-blur-sm px-5 py-4 rounded-2xl border border-gray-200/70 shadow-lg hover:shadow-xl transition-all duration-300">
              {getStatusIcon()}
              <span className="font-semibold">{getStatusText()}</span>
            </div>
            
            {onManualSave && hasUnsavedChanges && (
              <EnhancedButton
                onClick={onManualSave}
                ripple
                className="text-blue-700 hover:text-blue-800 text-sm font-bold transition-all duration-300 bg-blue-100/90 hover:bg-blue-200/90 backdrop-blur-sm px-5 py-3 rounded-2xl border border-blue-200/70 hover:border-blue-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Save now
              </EnhancedButton>
            )}
            
            <TranslateButton onTranslate={onTranslate} />
            
            <EnhancedButton
              onClick={onSave}
              disabled={saving || !content.trim()}
              ripple
              glow
              shimmer
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-3 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:ring-offset-2 disabled:hover:scale-100 disabled:hover:shadow-xl group border border-emerald-500/20"
            >
              {saving ? <LoadingSpinner size="sm" /> : <Save className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />}
              <span>
                {saving ? t('journal.saving') : 
                 isDraft ? 'Publish Entry' : 
                 t('journal.save')}
              </span>
            </EnhancedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingHeader;
