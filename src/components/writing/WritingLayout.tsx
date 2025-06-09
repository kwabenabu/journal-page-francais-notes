
import { JournalEntry } from "../../services/journalService";
import SmartTextSelector from "../SmartTextSelector";
import JournalSidebar from "../JournalSidebar";
import WritingEditor from "../WritingEditor";
import DraftRecovery from "../DraftRecovery";
import CommandPalette from "../CommandPalette";
import TranslationTooltip from "../TranslationTooltip";

interface WritingLayoutProps {
  // SmartTextSelector props
  handleTextSelect: (text: string, rect: DOMRect) => void;
  handleSelectionClear: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  
  // DraftRecovery props
  showDraftRecovery: boolean;
  recoverDraft: (content: string, serverId?: string) => void;
  setShowDraftRecovery: (show: boolean) => void;
  
  // JournalSidebar props
  entries: JournalEntry[];
  drafts: JournalEntry[];
  currentEntry: JournalEntry | null;
  loadEntry: (entry: JournalEntry) => void;
  deleteEntry: (id: string) => void;
  createNewEntry: () => void;
  searchEntries: (query: string) => void;
  
  // WritingEditor props
  content: string;
  saving: boolean;
  lastSaved: Date | null;
  lastAutoSaved?: Date | null;
  reviewing: boolean;
  error: string | null;
  autoSaveEnabled: boolean;
  setContent: (content: string) => void;
  saveEntry: () => void;
  translateSelectedText: () => Promise<boolean> | boolean;
  requestFrenchReview: (entryId: string, content: string) => void;
  manualSave: () => void;
  
  // CommandPalette props
  showCommandPalette: boolean;
  setShowCommandPalette: (show: boolean) => void;
  commandActions: any[];
  
  // TranslationTooltip props
  translation: any;
  handleCloseTooltip: () => void;
}

const WritingLayout = ({
  handleTextSelect,
  handleSelectionClear,
  textareaRef,
  showDraftRecovery,
  recoverDraft,
  setShowDraftRecovery,
  entries,
  drafts,
  currentEntry,
  loadEntry,
  deleteEntry,
  createNewEntry,
  searchEntries,
  content,
  saving,
  lastSaved,
  lastAutoSaved,
  reviewing,
  error,
  autoSaveEnabled,
  setContent,
  saveEntry,
  translateSelectedText,
  requestFrenchReview,
  manualSave,
  showCommandPalette,
  setShowCommandPalette,
  commandActions,
  translation,
  handleCloseTooltip
}: WritingLayoutProps) => {
  return (
    <div className="relative z-10 min-h-screen" id="main-content">
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

      <CommandPalette
        open={showCommandPalette}
        onOpenChange={setShowCommandPalette}
        actions={commandActions}
      />

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

export default WritingLayout;
