
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useJournal } from "../hooks/useJournal";
import { useTranslation } from "../hooks/useTranslation";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import TranslationTooltip from "./TranslationTooltip";
import SmartTextSelector from "./SmartTextSelector";
import JournalSidebar from "./JournalSidebar";
import WritingEditor from "./WritingEditor";
import DraftRecovery from "./DraftRecovery";
import CommandPalette from "./CommandPalette";
import AccessibilityHelper from "./AccessibilityHelper";

const WritingInterface = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
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

  // Define keyboard shortcuts
  const shortcuts = [
    {
      key: 's',
      ctrlKey: true,
      action: () => {
        if (content.trim()) {
          saveEntry();
          if ((window as any).announceToScreenReader) {
            (window as any).announceToScreenReader('Entry saved');
          }
        }
      },
      description: 'Save entry'
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => {
        createNewEntry();
        if ((window as any).announceToScreenReader) {
          (window as any).announceToScreenReader('New entry created');
        }
      },
      description: 'New entry'
    },
    {
      key: 't',
      ctrlKey: true,
      action: () => {
        translateSelectedText();
        if ((window as any).announceToScreenReader) {
          (window as any).announceToScreenReader('Translation requested');
        }
      },
      description: 'Translate selected text'
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => setShowCommandPalette(true),
      description: 'Open command palette'
    },
    {
      key: 'Escape',
      action: () => {
        if (showCommandPalette) {
          setShowCommandPalette(false);
        }
      },
      description: 'Close dialogs'
    }
  ];

  useKeyboardShortcuts(shortcuts);

  // Command palette actions
  const commandActions = [
    {
      id: 'new-entry',
      title: 'New Entry',
      description: 'Create a new journal entry',
      icon: Plus,
      action: createNewEntry,
      shortcut: 'Ctrl+N',
      group: 'Actions'
    },
    {
      id: 'save-entry',
      title: 'Save Entry',
      description: 'Save current entry',
      icon: Save,
      action: saveEntry,
      shortcut: 'Ctrl+S',
      group: 'Actions'
    },
    {
      id: 'translate',
      title: 'Translate Text',
      description: 'Translate selected text',
      icon: FileText,
      action: translateSelectedText,
      shortcut: 'Ctrl+T',
      group: 'Actions'
    },
    {
      id: 'request-review',
      title: 'Request Review',
      description: 'Get AI feedback on your French',
      icon: Star,
      action: () => currentEntry && requestFrenchReview(currentEntry.id, content),
      shortcut: '',
      group: 'Actions'
    },
    {
      id: 'search',
      title: 'Search Entries',
      description: 'Search through your journal entries',
      icon: Search,
      action: () => {
        // Focus search input in sidebar
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      shortcut: '/',
      group: 'Navigation'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Open application settings',
      icon: Settings,
      action: () => navigate('/settings'),
      shortcut: '',
      group: 'Navigation'
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  return (
    <AccessibilityHelper>
      <div className="min-h-screen chrome-gradient">
        {/* Main content */}
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
        </div>

        {/* Command Palette */}
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
    </AccessibilityHelper>
  );
};

export default WritingInterface;
