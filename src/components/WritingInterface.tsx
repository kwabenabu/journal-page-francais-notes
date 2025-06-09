
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
    reviewing,
    saveEntry,
    createNewEntry,
    loadEntry,
    deleteEntry,
    requestFrenchReview
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
    <div className="min-h-screen relative">
      {/* Spline 3D Background */}
      <div className="spline-background">
        <iframe 
          src="https://my.spline.design/100followers-8UQVye39LuVUUHVvMMW6VQi9?embed" 
          frameBorder="0" 
          width="100%" 
          height="100%"
          allow="autoplay; fullscreen"
          title="3D Background Animation"
        />
      </div>

      {/* Main content with glass effect overlay */}
      <div className="relative z-10 min-h-screen">
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
          <div className="glass-effect rounded-lg p-1">
            <JournalSidebar
              entries={entries}
              currentEntry={currentEntry}
              onLoadEntry={loadEntry}
              onDeleteEntry={deleteEntry}
            />
          </div>

          <div className="flex-1 glass-effect rounded-lg p-1">
            <WritingEditor
              content={content}
              currentEntry={currentEntry}
              saving={saving}
              lastSaved={lastSaved}
              reviewing={reviewing}
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
