
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useJournal } from "../hooks/useJournal";
import { useTranslation } from "../hooks/useTranslation";
import AccessibilityHelper from "./AccessibilityHelper";
import WritingLayout from "./writing/WritingLayout";
import { useWritingKeyboardShortcuts } from "./writing/KeyboardShortcuts";
import { useCommandActions } from "./writing/CommandActions";
import AppLayout from "./AppLayout";
import { Button } from "./ui/button";
import { FileText, Plus } from "lucide-react";
import { FloatingActionButton } from "./ui/floating-action-button";
import { useIsMobile } from "../hooks/use-mobile";

const WritingInterface = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
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
    autoSaveEnabled,
    saveEntry,
    createNewEntry,
    loadEntry,
    deleteEntry,
    requestFrenchReview,
    searchEntries,
    recoverDraft,
    setShowDraftRecovery,
    manualSave,
    saveOnNavigate
  } = useJournal();

  const {
    translation,
    handleTextSelect,
    handleSelectionClear,
    handleCloseTooltip,
    translateSelectedText
  } = useTranslation(textareaRef);

  // Save draft when component unmounts or route changes
  useEffect(() => {
    return () => {
      if (content.trim().length > 0) {
        console.log('WritingInterface unmounting, saving draft...');
        saveOnNavigate();
      }
    };
  }, [content, saveOnNavigate]);

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

  // Mobile-first New Button
  const newButton = isMobile ? null : (
    <Button 
      onClick={createNewEntry}
      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 touch-manipulation"
    >
      <FileText className="w-4 h-4" />
      <span className="hidden sm:inline">New Entry</span>
      <span className="sm:hidden">New</span>
    </Button>
  );

  return (
    <AppLayout title="Journal" rightElement={newButton}>
      <AccessibilityHelper>
        <div className="relative w-full">
          <WritingLayout
            handleTextSelect={handleTextSelect}
            handleSelectionClear={handleSelectionClear}
            textareaRef={textareaRef}
            showDraftRecovery={false}
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

          {/* Mobile Floating Action Button for New Entry */}
          {isMobile && (
            <FloatingActionButton
              icon={Plus}
              onClick={createNewEntry}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              position="bottom-right"
              size="lg"
            />
          )}
        </div>
      </AccessibilityHelper>
    </AppLayout>
  );
};

export default WritingInterface;
