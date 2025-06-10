
import { Save, Cloud, CloudOff } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { JournalEntry } from "../services/journalService";
import { EnhancedButton } from "./ui/enhanced-button";
import { LoadingSpinner } from "./ui/loading-spinner";
import { ProgressBar } from "./ui/progress-bar";
import TranslateButton from "./TranslateButton";
import FrenchReview from "./FrenchReview";

interface WritingEditorProps {
  content: string;
  currentEntry: JournalEntry | null;
  saving: boolean;
  lastSaved: Date | null;
  lastAutoSaved?: Date | null;
  reviewing?: boolean;
  error?: string | null;
  autoSaveEnabled?: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onTranslate: () => Promise<boolean> | boolean;
  onRequestReview?: (entryId: string, content: string) => void;
  onManualSave?: () => void;
}

const WritingEditor = ({ 
  content, 
  currentEntry, 
  saving, 
  lastSaved,
  lastAutoSaved,
  reviewing = false,
  error,
  autoSaveEnabled = true,
  textareaRef, 
  onContentChange, 
  onSave,
  onTranslate,
  onRequestReview,
  onManualSave
}: WritingEditorProps) => {
  const { t } = useLanguage();

  const isDraft = currentEntry?.is_draft;
  const hasUnsavedChanges = content !== (currentEntry?.content || "");
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const characterCount = content.length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed
  const progressValue = Math.min((wordCount / 300) * 100, 100); // Progress towards 300 words

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
    <div className="glass-card rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-500">
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="animate-slide-up">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
              {currentEntry ? 
                (isDraft ? t('journal.editDraft') : t('journal.editEntry')) : 
                t('journal.newEntryTitle')
              }
            </h2>
            {isDraft && (
              <div className="flex items-center space-x-3">
                <p className="text-sm text-blue-700 font-medium bg-blue-100/80 backdrop-blur-sm px-3 py-1 rounded-full inline-block animate-fade-in">
                  This is a draft. Your work saves automatically when you leave this page.
                </p>
                <ProgressBar value={progressValue} className="w-32" gradient animated />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center space-x-3 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
              {getStatusIcon()}
              <span className="font-medium">{getStatusText()}</span>
            </div>
            
            {onManualSave && hasUnsavedChanges && (
              <EnhancedButton
                onClick={onManualSave}
                ripple
                className="
                  text-blue-700 
                  hover:text-blue-800 
                  text-sm 
                  font-semibold 
                  transition-all
                  duration-300
                  bg-blue-100/80
                  hover:bg-blue-200/80
                  backdrop-blur-sm
                  px-4
                  py-2
                  rounded-xl
                  border
                  border-blue-200/60
                  hover:border-blue-300
                  hover:scale-105
                  active:scale-95
                "
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
              className="
                bg-gradient-to-r 
                from-emerald-600 
                to-green-600 
                hover:from-emerald-700 
                hover:to-green-700 
                disabled:from-gray-300 
                disabled:to-gray-400
                disabled:cursor-not-allowed 
                text-white 
                px-8 
                py-4 
                rounded-xl 
                font-semibold 
                transition-all 
                duration-300 
                flex 
                items-center 
                space-x-3 
                shadow-lg 
                hover:shadow-xl 
                hover:scale-105
                active:scale-95
                focus:outline-none
                focus:ring-3
                focus:ring-emerald-500/30
                focus:ring-offset-2
                disabled:hover:scale-100
                disabled:hover:shadow-lg
                group
              "
            >
              {saving ? <LoadingSpinner size="sm" /> : <Save className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />}
              <span>
                {saving ? t('journal.saving') : 
                 isDraft ? 'Publish' : 
                 t('journal.save')}
              </span>
            </EnhancedButton>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8">
        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 rounded-xl text-red-700 text-sm animate-fade-in backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <div className="font-semibold mb-1 flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Error</span>
            </div>
            {error}
          </div>
        )}
        
        <div className="mb-6 p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/60 rounded-xl text-blue-800 text-sm backdrop-blur-sm animate-fade-in">
          <div className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Writing Tips</span>
          </div>
          <p className="leading-relaxed">
            {t('journal.instructions')} Double-click any word or phrase to auto-select and get instant translations. 
            Use <kbd className="px-2 py-1 bg-white/80 rounded text-xs font-mono border border-blue-200 shadow-sm">Ctrl+T</kbd> to translate selected text.
          </p>
          {autoSaveEnabled && (
            <p className="mt-3 text-emerald-700 bg-emerald-50/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-emerald-200/60 inline-flex items-center space-x-2">
              <Cloud className="w-4 h-4" />
              <span className="font-medium">Your work automatically saves when you leave this page.</span>
            </p>
          )}
        </div>
        
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={t('journal.placeholder')}
            className="
              w-full 
              h-96 
              p-8 
              border-2 
              border-gray-200/60 
              rounded-2xl 
              resize-none 
              focus:outline-none 
              focus:ring-3 
              focus:ring-blue-500/30 
              focus:border-blue-400
              text-gray-800 
              leading-relaxed 
              transition-all 
              duration-300
              bg-white/60
              backdrop-blur-sm
              placeholder:text-gray-400
              shadow-inner
              hover:bg-white/80
              focus:bg-white/90
              hover:shadow-lg
              focus:shadow-xl
            "
            style={{ fontFamily: 'inherit' }}
          />
          
          {/* Enhanced floating stats */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/60 text-xs text-gray-600 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">{wordCount} words</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{characterCount} chars</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center text-xs text-gray-500">
          <div className="flex space-x-6">
            <span className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-sm"></div>
              <span className="font-medium">French content</span>
            </span>
            <span className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
              <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-rose-500 rounded-full shadow-sm"></div>
              <span className="font-medium">English feedback</span>
            </span>
            {isDraft && (
              <span className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
                <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-sm"></div>
                <span className="font-medium">Saves on exit</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-100/80 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/50 hover:shadow-md transition-all duration-300">
            Last updated: {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>

      {currentEntry && onRequestReview && !isDraft && (
        <FrenchReview 
          entry={currentEntry} 
          onRequestReview={onRequestReview}
          isReviewing={reviewing}
        />
      )}
    </div>
  );
};

export default WritingEditor;
