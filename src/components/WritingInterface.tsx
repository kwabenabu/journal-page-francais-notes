
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useJournal } from "../hooks/useJournal";
import { useTranslation } from "../hooks/useTranslation";
import AccessibilityHelper from "./AccessibilityHelper";
import WritingLayout from "./writing/WritingLayout";
import { useWritingKeyboardShortcuts } from "./writing/KeyboardShortcuts";
import { useCommandActions } from "./writing/CommandActions";

const WritingInterface = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    content,
    setContent,
    currentEntry,
    entries,
    drafts,
    saving,
    lastSaved,
    lastAutoSaved,
    reviewing,
    error,
    showDraftRecovery,
    autoSaveEnabled,
    saveEntry,
    createNewEntry,
    loadEntry,
    deleteEntry,
    requestFrenchReview,
    searchEntries,
    recoverDraft,
    setShowDraftRecovery,
    manualSave
  } = useJournal();

  const {
    translation,
    handleTextSelect,
    handleSelectionClear,
    handleCloseTooltip,
    translateSelectedText
  } = useTranslation(textareaRef);

  // Set up keyboard shortcuts
  useWritingKeyboardShortcuts({
    content,
    saveEntry,
    createNewEntry,
    translateSelectedText,
    setShowCommandPalette,
    showCommandPalette
  });

  // Set up command actions
  const commandActions = useCommandActions({
    createNewEntry,
    saveEntry,
    translateSelectedText,
    currentEntry,
    requestFrenchReview,
    content,
    navigate
  });

  if (!user) {
    return null;
  }

  return (
    <AccessibilityHelper>
      <div className="min-h-screen chrome-gradient">
        <WritingLayout
          handleTextSelect={handleTextSelect}
          handleSelectionClear={handleSelectionClear}
          textareaRef={textareaRef}
          showDraftRecovery={showDraftRecovery}
          recoverDraft={recoverDraft}
          setShowDraftRecovery={setShowDraftRecovery}
          entries={entries}
          drafts={drafts}
          currentEntry={currentEntry}
          loadEntry={loadEntry}
          deleteEntry={deleteEntry}
          createNewEntry={createNewEntry}
          searchEntries={searchEntries}
          content={content}
          saving={saving}
          lastSaved={lastSaved}
          lastAutoSaved={lastAutoSaved}
          reviewing={reviewing}
          error={error}
          autoSaveEnabled={autoSaveEnabled}
          setContent={setContent}
          saveEntry={saveEntry}
          translateSelectedText={translateSelectedText}
          requestFrenchReview={requestFrenchReview}
          manualSave={manualSave}
          showCommandPalette={showCommandPalette}
          setShowCommandPalette={setShowCommandPalette}
          commandActions={commandActions}
          translation={translation}
          handleCloseTooltip={handleCloseTooltip}
        />
      </div>
    </AccessibilityHelper>
  );
};

export default WritingInterface;
