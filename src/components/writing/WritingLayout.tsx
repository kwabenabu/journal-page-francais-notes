
import { JournalEntry } from "../../services/journalService";
import SmartTextSelector from "../SmartTextSelector";
import JournalSidebar from "../JournalSidebar";
import WritingEditor from "../WritingEditor";
import DraftRecovery from "../DraftRecovery";
import CommandPalette from "../CommandPalette";
import TranslationTooltip from "../TranslationTooltip";
import SidebarStats from "../sidebar/SidebarStats";
import { useIsMobile } from "../../hooks/use-mobile";

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
  setShowCommandPalette: (show: boolean)=> void;
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
  const isMobile = useIsMobile();

  return (
    <div className="flex h-full bg-gradient-to-br from-blue-50/30 to-indigo-50/30 w-full">
      <SmartTextSelector
        onTextSelect={handleTextSelect}
        onSelectionClear={handleSelectionClear}
        textareaRef={textareaRef}
      />

      {showDraftRecovery && (
        <DraftRecovery
          onRecoverDraft={recoverDraft}
          onDismiss={() => setShowDraftRecovery(false)}
        />
      )}
      
      {/* Mobile-responsive Sidebar - Hidden on mobile, managed by AppLayout */}
      {!isMobile && (
        <div className="hidden lg:block w-80 xl:w-96 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 shadow-lg">
          <div className="h-full flex flex-col">
            {/* Stats Section */}
            <div className="border-b border-gray-200/50">
              <SidebarStats entries={entries} drafts={drafts} />
            </div>
            
            {/* Journal Sidebar */}
            <div className="flex-1 overflow-hidden">
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
          </div>
        </div>
      )}

      {/* Mobile-first Main Editor */}
      <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto min-w-0 w-full">
        <div className="max-w-4xl mx-auto w-full">
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
