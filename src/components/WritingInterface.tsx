
import { useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useJournal } from "../hooks/useJournal";
import { useTranslation } from "../hooks/useTranslation";
import TranslationTooltip from "./TranslationTooltip";
import SmartTextSelector from "./SmartTextSelector";
import JournalSidebar from "./JournalSidebar";
import WritingEditor from "./WritingEditor";

const WritingInterface = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const {
    content,
    setContent,
    currentEntry,
    entries,
    saving,
    lastSaved,
    reviewing,
    error,
    saveEntry,
    createNewEntry,
    loadEntry,
    deleteEntry,
    requestFrenchReview,
    searchEntries
  } = useJournal();

  const {
    translation,
    handleTextSelect,
    handleSelectionClear,
    handleCloseTooltip,
    translateSelectedText
  } = useTranslation(textareaRef);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen chrome-gradient">
      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        <SmartTextSelector
          onTextSelect={handleTextSelect}
          onSelectionClear={handleSelectionClear}
          textareaRef={textareaRef}
        />

        <div className="max-w-7xl mx-auto p-6 flex gap-6">
          <div className="w-80 chrome-metallic rounded-lg p-4 shadow-lg">
            <JournalSidebar
              entries={entries}
              currentEntry={currentEntry}
              onLoadEntry={loadEntry}
              onDeleteEntry={deleteEntry}
              onNewEntry={createNewEntry}
              onSearch={searchEntries}
            />
          </div>

          <div className="flex-1 chrome-metallic rounded-lg p-6 shadow-lg">
            <WritingEditor
              content={content}
              currentEntry={currentEntry}
              saving={saving}
              lastSaved={lastSaved}
              reviewing={reviewing}
              error={error}
              textareaRef={textareaRef}
              onContentChange={setContent}
              onSave={saveEntry}
              onTranslate={translateSelectedText}
              onRequestReview={requestFrenchReview}
            />
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
