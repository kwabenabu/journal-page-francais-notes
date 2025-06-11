
import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { JournalEntry } from "../services/journalService";
import FrenchReview from "./FrenchReview";
import WritingToolbar from "./writing/WritingToolbar";
import WritingHeader from "./writing/WritingHeader";
import WritingContent from "./writing/WritingContent";

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
  const [showToolbar, setShowToolbar] = useState(false);

  const isDraft = currentEntry?.is_draft;

  // Sticky toolbar logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowToolbar(scrollPosition > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Sticky Toolbar */}
      <WritingToolbar
        showToolbar={showToolbar}
        saving={saving}
        content={content}
        isDraft={isDraft}
        onSave={onSave}
        onTranslate={onTranslate}
      />

      <div className="glass-card rounded-3xl shadow-xl border border-white/40 overflow-hidden hover:shadow-2xl transition-all duration-700 bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-xl">
        {/* Enhanced Header */}
        <WritingHeader
          currentEntry={currentEntry}
          saving={saving}
          lastSaved={lastSaved}
          lastAutoSaved={lastAutoSaved}
          autoSaveEnabled={autoSaveEnabled}
          content={content}
          onSave={onSave}
          onTranslate={onTranslate}
          onManualSave={onManualSave}
        />

        {/* Content Area */}
        <WritingContent
          content={content}
          error={error}
          autoSaveEnabled={autoSaveEnabled}
          textareaRef={textareaRef}
          onContentChange={onContentChange}
        />

        {currentEntry && onRequestReview && !isDraft && (
          <FrenchReview 
            entry={currentEntry} 
            onRequestReview={onRequestReview}
            isReviewing={reviewing}
          />
        )}
      </div>
    </div>
  );
};

export default WritingEditor;
