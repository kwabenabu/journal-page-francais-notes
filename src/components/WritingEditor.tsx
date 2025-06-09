
import { Save, Cloud, CloudOff } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { JournalEntry } from "../services/journalService";
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

  const getStatusText = () => {
    if (saving) return t('journal.saving');
    if (isDraft) {
      if (lastAutoSaved) {
        return `Draft auto-saved at ${lastAutoSaved.toLocaleTimeString('fr-FR')}`;
      }
      return "Draft (auto-save enabled)";
    }
    if (lastSaved) {
      return `${t('journal.savedAt')} ${lastSaved.toLocaleTimeString('fr-FR')}`;
    }
    return "Not saved";
  };

  const getStatusIcon = () => {
    if (saving) return <Cloud className="w-4 h-4 animate-pulse" />;
    if (autoSaveEnabled && hasUnsavedChanges) return <Cloud className="w-4 h-4 text-blue-500" />;
    if (lastSaved || lastAutoSaved) return <Cloud className="w-4 h-4 text-green-500" />;
    return <CloudOff className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6 bg-gradient-to-r from-blue-50 to-red-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-800">
              {currentEntry ? 
                (isDraft ? t('journal.editDraft') : t('journal.editEntry')) : 
                t('journal.newEntryTitle')
              }
            </h2>
            {isDraft && (
              <p className="text-sm text-blue-600 mt-1">
                This is a draft. Click "Publish" to make it visible in your journal.
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-full border">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
            
            {onManualSave && hasUnsavedChanges && (
              <button
                onClick={onManualSave}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                Save now
              </button>
            )}
            
            <TranslateButton onTranslate={onTranslate} />
            
            <button
              onClick={onSave}
              disabled={saving || !content.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Save className="w-5 h-5" />
              <span>
                {saving ? t('journal.saving') : 
                 isDraft ? 'Publish' : 
                 t('journal.save')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-fade-in">
            {error}
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <span className="font-medium text-blue-800">Writing Tips:</span> {t('journal.instructions')} 
          Double-click any word or phrase to auto-select and get instant translations. 
          Use <kbd className="px-2 py-1 bg-white rounded text-xs font-mono border">Ctrl+T</kbd> to translate selected text.
          {autoSaveEnabled && (
            <span className="block mt-2 text-green-700">
              <Cloud className="w-4 h-4 inline mr-1" />
              Auto-save is enabled - your work is automatically saved as you type.
            </span>
          )}
        </p>
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={t('journal.placeholder')}
          className="w-full h-96 p-6 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 leading-relaxed transition-all duration-200"
          style={{ fontFamily: 'inherit' }}
        />
        
        <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
          <span>{content.length} {t('journal.characters')}</span>
          <div className="flex space-x-4">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
              French content
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
              English feedback
            </span>
            {isDraft && (
              <span className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                Draft mode
              </span>
            )}
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
