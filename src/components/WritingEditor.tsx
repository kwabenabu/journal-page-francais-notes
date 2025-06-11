import { Save, Cloud, CloudOff, TrendingUp, Target, Clock, Zap } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { JournalEntry } from "../services/journalService";
import { EnhancedButton } from "./ui/enhanced-button";
import { LoadingSpinner } from "./ui/loading-spinner";
import { ProgressBar } from "./ui/progress-bar";
import TranslateButton from "./TranslateButton";
import FrenchReview from "./FrenchReview";
import { useState, useEffect, useCallback } from "react";

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
  const [dynamicTip, setDynamicTip] = useState("");

  const isDraft = currentEntry?.is_draft;
  const hasUnsavedChanges = content !== (currentEntry?.content || "");
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const characterCount = content.length;
  const readingTime = Math.ceil(wordCount / 200);
  const progressValue = Math.min((wordCount / 300) * 100, 100);

  // Auto-scroll function to keep cursor visible
  const scrollToCursor = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Get cursor position
    const cursorPosition = textarea.selectionStart;
    
    // Create a temporary element to measure text
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.height = 'auto';
    div.style.width = textarea.clientWidth + 'px';
    div.style.fontSize = getComputedStyle(textarea).fontSize;
    div.style.fontFamily = getComputedStyle(textarea).fontFamily;
    div.style.lineHeight = getComputedStyle(textarea).lineHeight;
    div.style.padding = getComputedStyle(textarea).padding;
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    
    document.body.appendChild(div);
    
    // Get text up to cursor
    const textToCursor = content.substring(0, cursorPosition);
    div.textContent = textToCursor;
    
    const cursorHeight = div.scrollHeight;
    document.body.removeChild(div);
    
    // Calculate if we need to scroll
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const scrollTop = textarea.scrollTop;
    const clientHeight = textarea.clientHeight;
    
    // If cursor is below visible area, scroll down
    if (cursorHeight > scrollTop + clientHeight) {
      textarea.scrollTop = cursorHeight - clientHeight + lineHeight;
    }
    // If cursor is above visible area, scroll up
    else if (cursorHeight < scrollTop) {
      textarea.scrollTop = Math.max(0, cursorHeight - lineHeight);
    }
  }, [content, textareaRef]);

  // Enhanced content change handler with auto-scroll
  const handleContentChange = useCallback((newContent: string) => {
    onContentChange(newContent);
    // Use requestAnimationFrame to ensure DOM is updated before scrolling
    requestAnimationFrame(() => {
      scrollToCursor();
    });
  }, [onContentChange, scrollToCursor]);

  // Dynamic writing tips based on content
  useEffect(() => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("je suis allé") || lowerContent.includes("j'ai été")) {
      setDynamicTip("💡 Great use of past tense! Remember: 'je suis allé' (masculine) vs 'je suis allée' (feminine)");
    } else if (lowerContent.includes("aujourd'hui")) {
      setDynamicTip("🌟 Perfect! 'Aujourd'hui' is a great way to start daily entries");
    } else if (lowerContent.includes("j'ai appris") || lowerContent.includes("j'apprends")) {
      setDynamicTip("🎯 Excellent! Writing about learning helps reinforce new vocabulary");
    } else if (wordCount > 0 && wordCount < 50) {
      setDynamicTip("✍️ Keep going! Try describing your feelings or what you observed today");
    } else if (wordCount >= 100) {
      setDynamicTip("🔥 You're on fire! This is a substantial entry - great work!");
    } else {
      setDynamicTip("💭 Tip: Try starting with 'Aujourd'hui...' or 'Je pense que...'");
    }
  }, [content, wordCount]);

  // Sticky toolbar logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowToolbar(scrollPosition > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getStatusText = () => {
    if (saving) return t('journal.saving');
    if (isDraft) {
      if (lastAutoSaved) {
        return `Draft auto-saved at ${lastAutoSaved.toLocaleTimeString('fr-FR')}`;
      }
      return "Draft (saves when you leave)";
    }
    if (lastSaved) {
      return `${t('journal.savedAt')} ${lastSaved.toLocaleTimeString('fr-FR')}`;
    }
    return "Not saved";
  };

  const getStatusIcon = () => {
    if (saving) return <LoadingSpinner size="sm" className="text-blue-500" />;
    if (autoSaveEnabled && hasUnsavedChanges) return <Cloud className="w-4 h-4 text-blue-500" />;
    if (lastSaved || lastAutoSaved) return <Cloud className="w-4 h-4 text-emerald-500" />;
    return <CloudOff className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="relative">
      {/* Sticky Toolbar */}
      {showToolbar && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg animate-slide-in-right">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Writing Mode Active</span>
            </div>
            <div className="flex items-center space-x-3">
              <TranslateButton onTranslate={onTranslate} />
              <EnhancedButton
                onClick={onSave}
                disabled={saving || !content.trim()}
                ripple
                glow
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Saving...' : isDraft ? 'Publish' : 'Save'}</span>
              </EnhancedButton>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card rounded-3xl shadow-xl border border-white/40 overflow-hidden hover:shadow-2xl transition-all duration-700 bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-xl">
        {/* Enhanced Header */}
        <div className="border-b border-white/30 px-8 py-8 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 animate-pulse"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="animate-slide-up">
                <h2 className="text-4xl font-serif font-bold text-gray-800 mb-3 bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  {currentEntry ? 
                    (isDraft ? t('journal.editDraft') : t('journal.editEntry')) : 
                    'Your French Journey ✨'
                  }
                </h2>
                {isDraft && (
                  <div className="flex items-center space-x-4 mb-4">
                    <p className="text-sm text-blue-800 font-semibold bg-blue-200/80 backdrop-blur-sm px-4 py-2 rounded-full inline-flex items-center space-x-2 animate-fade-in border border-blue-300/50">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <span>Draft Mode - Auto-saving as you write</span>
                    </p>
                    <ProgressBar value={progressValue} className="w-40" gradient animated />
                  </div>
                )}
                
                {/* Enhanced Progress Stats */}
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/60 shadow-sm">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-gray-700">{wordCount} words</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/60 shadow-sm">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold text-gray-700">{Math.round(progressValue)}% to goal</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/60 shadow-sm">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-semibold text-gray-700">{readingTime} min read</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center space-x-3 text-sm text-gray-600 bg-white/90 backdrop-blur-sm px-5 py-4 rounded-2xl border border-gray-200/70 shadow-lg hover:shadow-xl transition-all duration-300">
                  {getStatusIcon()}
                  <span className="font-semibold">{getStatusText()}</span>
                </div>
                
                {onManualSave && hasUnsavedChanges && (
                  <EnhancedButton
                    onClick={onManualSave}
                    ripple
                    className="text-blue-700 hover:text-blue-800 text-sm font-bold transition-all duration-300 bg-blue-100/90 hover:bg-blue-200/90 backdrop-blur-sm px-5 py-3 rounded-2xl border border-blue-200/70 hover:border-blue-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    Save now
                  </EnhancedButton>
                )}
                
                <TranslateButton onTranslate={onTranslate} />
                
                <EnhancedButton
                  onClick={onSave}
                  disabled={saving || !content.trim()}
                  ripple
                  glow
                  shimmer
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-3 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:ring-offset-2 disabled:hover:scale-100 disabled:hover:shadow-xl group border border-emerald-500/20"
                >
                  {saving ? <LoadingSpinner size="sm" /> : <Save className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />}
                  <span>
                    {saving ? t('journal.saving') : 
                     isDraft ? 'Publish Entry' : 
                     t('journal.save')}
                  </span>
                </EnhancedButton>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/70 rounded-2xl text-red-700 text-sm animate-fade-in backdrop-blur-sm hover:shadow-lg transition-all duration-300 shadow-md">
              <div className="font-bold mb-2 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>Error</span>
              </div>
              {error}
            </div>
          )}
          
          {/* Dynamic Writing Tips */}
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/70 rounded-2xl text-blue-800 text-sm backdrop-blur-sm animate-fade-in shadow-md hover:shadow-lg transition-all duration-300">
            <div className="font-bold text-blue-900 mb-3 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Smart Writing Assistant</span>
            </div>
            <p className="leading-relaxed font-medium mb-3">
              {dynamicTip}
            </p>
            <p className="text-blue-700 text-xs">
              💡 Double-click any word for instant translations • Use <kbd className="px-2 py-1 bg-white/90 rounded-lg text-xs font-mono border border-blue-200 shadow-sm">Ctrl+T</kbd> for selected text
            </p>
            {autoSaveEnabled && (
              <p className="mt-4 text-emerald-800 bg-emerald-100/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-emerald-200/70 inline-flex items-center space-x-2 shadow-sm">
                <Cloud className="w-4 h-4" />
                <span className="font-semibold">Auto-save is active - your work is protected</span>
              </p>
            )}
          </div>
          
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Ex. Aujourd'hui, j'ai appris le mot 's'améliorer' qui signifie 'to improve'. Je pense que c'est un mot très utile pour décrire mon parcours d'apprentissage du français..."
              className="w-full h-96 p-8 border-2 border-gray-200/70 rounded-3xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 text-gray-800 text-lg leading-relaxed transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder:text-gray-400 placeholder:italic shadow-inner hover:bg-white/90 focus:bg-white/95 hover:shadow-lg focus:shadow-xl font-serif overflow-y-auto"
              style={{ fontFamily: 'inherit' }}
            />
            
            {/* Enhanced floating stats with icons */}
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl border border-gray-200/70 text-sm text-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 group hover:scale-105 transition-transform duration-200">
                  <TrendingUp className="w-4 h-4 text-blue-500 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="font-bold text-blue-700">{wordCount} words</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center space-x-2 group hover:scale-105 transition-transform duration-200">
                  <Target className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-bold text-green-700">{characterCount} chars</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center space-x-2 group hover:scale-105 transition-transform duration-200">
                  <Clock className="w-4 h-4 text-purple-500 group-hover:rotate-12 transition-transform duration-200" />
                  <span className="font-bold text-purple-700">{readingTime} min</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between items-center text-sm text-gray-500">
            <div className="flex space-x-8">
              <span className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200 cursor-pointer">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-md"></div>
                <span className="font-semibold">French content</span>
              </span>
              <span className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200 cursor-pointer">
                <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-rose-600 rounded-full shadow-md"></div>
                <span className="font-semibold">English feedback</span>
              </span>
              {isDraft && (
                <span className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200 cursor-pointer">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-600 rounded-full shadow-md animate-pulse"></div>
                  <span className="font-semibold">Auto-saving</span>
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-500 bg-gray-100/90 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-200/70 hover:shadow-md transition-all duration-300 font-medium">
              Last updated: {new Date().toLocaleTimeString('fr-FR')}
            </div>
          </div>
        </div>

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
