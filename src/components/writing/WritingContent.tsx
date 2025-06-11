import { Cloud, Zap } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import WritingStats from "./WritingStats";

interface WritingContentProps {
  content: string;
  error?: string | null;
  autoSaveEnabled?: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onContentChange: (content: string) => void;
}

const WritingContent = ({
  content,
  error,
  autoSaveEnabled = true,
  textareaRef,
  onContentChange
}: WritingContentProps) => {
  const [dynamicTip, setDynamicTip] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [isHoveringStats, setIsHoveringStats] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

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

  // Enhanced content change handler with auto-scroll and typing detection
  const handleContentChange = useCallback((newContent: string) => {
    onContentChange(newContent);
    
    // Set typing state and hide stats
    setIsTyping(true);
    setShowStats(false);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to show stats after idle period
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (!isHoveringStats) {
        setShowStats(true);
      }
    }, 2000); // Show stats 2 seconds after typing stops
    
    // Use requestAnimationFrame to ensure DOM is updated before scrolling
    requestAnimationFrame(() => {
      scrollToCursor();
    });
  }, [onContentChange, scrollToCursor, isHoveringStats]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Handle stats area hover
  const handleStatsMouseEnter = useCallback(() => {
    setIsHoveringStats(true);
    setShowStats(true);
  }, []);

  const handleStatsMouseLeave = useCallback(() => {
    setIsHoveringStats(false);
    if (!isTyping) {
      // Small delay before hiding to prevent flickering
      setTimeout(() => {
        if (!isHoveringStats) {
          setShowStats(true); // Keep visible when not typing
        }
      }, 100);
    }
  }, [isTyping, isHoveringStats]);

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

  return (
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
        
        <WritingStats
          content={content}
          showStats={showStats}
          onStatsMouseEnter={handleStatsMouseEnter}
          onStatsMouseLeave={handleStatsMouseLeave}
        />
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
        </div>
        
        <div className="text-sm text-gray-500 bg-gray-100/90 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-200/70 hover:shadow-md transition-all duration-300 font-medium">
          Last updated: {new Date().toLocaleTimeString('fr-FR')}
        </div>
      </div>
    </div>
  );
};

export default WritingContent;
