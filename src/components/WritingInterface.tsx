
import { useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useJournal } from "../hooks/useJournal";
import { useTranslation } from "../hooks/useTranslation";
import TranslationTooltip from "./TranslationTooltip";
import SmartTextSelector from "./SmartTextSelector";
import WritingHeader from "./WritingHeader";
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
    saveEntry,
    createNewEntry,
    loadEntry,
    deleteEntry
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
    <div className="min-h-screen bg-gray-50">
      <SmartTextSelector
        onTextSelect={handleTextSelect}
        onSelectionClear={handleSelectionClear}
        textareaRef={textareaRef}
      />
      
      <WritingHeader
        userEmail={user.email}
        onNewEntry={createNewEntry}
        onSignOut={handleSignOut}
      />

      <div className="max-w-6xl mx-auto p-6 flex gap-6">
        <JournalSidebar
          entries={entries}
          currentEntry={currentEntry}
          onLoadEntry={loadEntry}
          onDeleteEntry={deleteEntry}
        />

        <WritingEditor
          content={content}
          currentEntry={currentEntry}
          saving={saving}
          lastSaved={lastSaved}
          textareaRef={textareaRef}
          onContentChange={setContent}
          onSave={saveEntry}
          onTranslate={translateSelectedText}
        />
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
