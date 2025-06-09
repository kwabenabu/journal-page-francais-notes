
import { useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useJournal } from "../hooks/useJournal";
import { useTranslation } from "../hooks/useTranslation";
import TranslationTooltip from "./TranslationTooltip";
import SmartTextSelector from "./SmartTextSelector";
import JournalSidebar from "./JournalSidebar";
import WritingEditor from "./WritingEditor";
import DraftRecovery from "./DraftRecovery";

const WritingInterface = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user, signOut } = useAuth();
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

        <div className="max-w-7xl mx-auto p-6">
          {showDraftRecovery && (
            <DraftRecovery
              onRecoverDraft={recoverDraft}
              onDismiss={() => setShowDraftRecovery(false)}
            />
          )}
          
          <div className="flex gap-8 animate-fade-in">
            <div className="w-80 chrome-metallic rounded-2xl p-6 shadow-xl animate-scale-in">
              <JournalSidebar
                entries={entries}
                drafts={drafts}
                currentEntry={currentEntry}
                onLoadEntry={loadEntry}
                onDeleteEntry={deleteEntry}
                onNewEntry={createNewEntry}
                onSearch={searchEntries}
              />
            </div>

            <div className="flex-1 animate-scale-in" style={{ animationDelay: '100ms' }}>
              <WritingEditor
                content={content}
                currentEntry={currentEntry}
                saving={saving}
                lastSaved={lastSaved}
                lastAutoSaved={lastAutoSaved}
                reviewing={reviewing}
                error={error}
                autoSaveEnabled={autoSaveEnabled}
                textareaRef={textareaRef}
                onContentChange={setContent}
                onSave={saveEntry}
                onTranslate={translateSelectedText}
                onRequestReview={requestFrenchReview}
                onManualSave={manualSave}
              />
            </div>
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
