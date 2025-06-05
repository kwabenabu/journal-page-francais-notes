
import { Save } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { JournalEntry } from "../services/journalService";

interface WritingEditorProps {
  content: string;
  currentEntry: JournalEntry | null;
  saving: boolean;
  lastSaved: Date | null;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onContentChange: (content: string) => void;
  onSave: () => void;
}

const WritingEditor = ({ 
  content, 
  currentEntry, 
  saving, 
  lastSaved, 
  textareaRef, 
  onContentChange, 
  onSave 
}: WritingEditorProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold text-gray-800">
          {currentEntry ? t('journal.editEntry') : t('journal.newEntryTitle')}
        </h2>
        <div className="flex items-center space-x-4">
          {lastSaved && (
            <span className="text-sm text-gray-500">
              {t('journal.savedAt')} {lastSaved.toLocaleTimeString('fr-FR')}
            </span>
          )}
          <button
            onClick={onSave}
            disabled={saving || !content.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? t('journal.saving') : t('journal.save')}</span>
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        {t('journal.instructions')} Double-click any word or phrase to auto-select and get instant translations.
      </p>
      
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder={t('journal.placeholder')}
        className="w-full h-96 p-6 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-800 leading-relaxed"
        style={{ fontFamily: 'inherit' }}
      />
      
      <div className="mt-4 text-xs text-gray-500">
        {content.length} {t('journal.characters')}
      </div>
    </div>
  );
};

export default WritingEditor;
