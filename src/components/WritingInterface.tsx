import { useState, useRef, useEffect } from "react";
import { translateWord } from "../services/realTimeTranslationService";
import { journalService, JournalEntry } from "../services/journalService";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import TranslationTooltip from "./TranslationTooltip";
import SmartTextSelector from "./SmartTextSelector";
import LanguageToggle from "./LanguageToggle";
import { Save, LogOut, BookOpen, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WritingInterface = () => {
  const [content, setContent] = useState("");
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [translation, setTranslation] = useState<{
    word: string;
    translation: string;
    sourceLanguage: 'en' | 'fr';
    targetLanguage: 'en' | 'fr';
    position: { x: number; y: number };
  } | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadEntries();
  }, [user, navigate]);

  const handleTextSelect = async (selectedText: string, position: { x: number; y: number }) => {
    if (!selectedText || selectedText.length < 2) {
      setTranslation(null);
      return;
    }

    const translationResult = await translateWord(selectedText);
    if (translationResult) {
      setTranslation({
        word: selectedText,
        translation: translationResult.translatedText,
        sourceLanguage: translationResult.sourceLanguage,
        targetLanguage: translationResult.targetLanguage,
        position
      });
    } else {
      setTranslation(null);
    }
  };

  const handleSelectionClear = () => {
    setTranslation(null);
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setTranslation(null);
        return;
      }

      const selectedText = selection.toString().trim();
      
      // Now support multi-word selections (removed single word restriction)
      if (!selectedText || selectedText.length < 2) {
        setTranslation(null);
        return;
      }

      // Check if selection is within our textarea
      const range = selection.getRangeAt(0);
      const textarea = textareaRef.current;
      if (!textarea || !textarea.contains(range.commonAncestorContainer)) {
        setTranslation(null);
        return;
      }

      const translationResult = translateWord(selectedText);
      if (translationResult) {
        const rect = range.getBoundingClientRect();
        setTranslation({
          word: selectedText,
          translation: translationResult.translatedText,
          sourceLanguage: translationResult.sourceLanguage,
          targetLanguage: translationResult.targetLanguage,
          position: {
            x: rect.left + rect.width / 2,
            y: rect.top
          }
        });
      } else {
        setTranslation(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const loadEntries = async () => {
    const { data, error } = await journalService.getEntries();
    if (error) {
      console.error("Error loading entries:", error);
    } else if (data) {
      setEntries(data);
    }
  };

  const saveEntry = async () => {
    if (!content.trim()) return;

    setSaving(true);
    try {
      if (currentEntry) {
        const { data, error } = await journalService.updateEntry(currentEntry.id, content);
        if (error) throw error;
        if (data) {
          setCurrentEntry(data);
          setEntries(prev => prev.map(entry => entry.id === data.id ? data : entry));
        }
      } else {
        const { data, error } = await journalService.saveEntry(content);
        if (error) throw error;
        if (data) {
          setCurrentEntry(data);
          setEntries(prev => [data, ...prev]);
        }
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving entry:", error);
    } finally {
      setSaving(false);
    }
  };

  const createNewEntry = () => {
    setContent("");
    setCurrentEntry(null);
  };

  const loadEntry = (entry: JournalEntry) => {
    setContent(entry.content);
    setCurrentEntry(entry);
  };

  const deleteEntry = async (id: string) => {
    const { error } = await journalService.deleteEntry(id);
    if (error) {
      console.error("Error deleting entry:", error);
    } else {
      setEntries(prev => prev.filter(entry => entry.id !== id));
      if (currentEntry?.id === id) {
        setContent("");
        setCurrentEntry(null);
      }
    }
  };

  const handleCloseTooltip = () => {
    setTranslation(null);
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SmartTextSelector
        onTextSelect={handleTextSelect}
        onSelectionClear={handleSelectionClear}
        textareaRef={textareaRef}
      />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-amber-600" />
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-800">{t('journal.title')}</h1>
              <p className="text-sm text-gray-600">{t('journal.welcome')}, {user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <button
              onClick={createNewEntry}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>{t('journal.newEntry')}</span>
            </button>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 flex gap-6">
        {/* Sidebar - Journal Entries */}
        <div className="w-1/3 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('journal.myEntries')}</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
                  currentEntry?.id === entry.id
                    ? "bg-amber-50 border-amber-200"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => loadEntry(entry)}
              >
                <div className="text-sm text-gray-600 mb-1">
                  {new Date(entry.updated_at).toLocaleDateString('fr-FR')}
                </div>
                <div className="text-sm text-gray-800 line-clamp-2">
                  {entry.content.substring(0, 100)}...
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEntry(entry.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-xs mt-2"
                >
                  {t('journal.delete')}
                </button>
              </div>
            ))}
            {entries.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                {t('journal.noEntries')}
              </div>
            )}
          </div>
        </div>

        {/* Main Writing Area */}
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
                onClick={saveEntry}
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
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('journal.placeholder')}
            className="w-full h-96 p-6 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-800 leading-relaxed"
            style={{ fontFamily: 'inherit' }}
          />
          
          <div className="mt-4 text-xs text-gray-500">
            {content.length} {t('journal.characters')}
          </div>
        </div>
      </div>

      {translation && (
        <TranslationTooltip
          word={translation.word}
          translation={translation.translation}
          sourceLanguage={translation.sourceLanguage}
          targetLanguage={translation.targetLanguage}
          position={translation.position}
          onClose={handleCloseTooltip}
        />
      )}
    </div>
  );
};

export default WritingInterface;
