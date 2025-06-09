
import { useState } from "react";
import { Languages } from "lucide-react";
import { EnhancedButton } from "./ui/enhanced-button";

interface TranslateButtonProps {
  onTranslate: () => Promise<boolean> | boolean;
}

const TranslateButton = ({ onTranslate }: TranslateButtonProps) => {
  const [feedback, setFeedback] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    setFeedback("");
    
    try {
      console.log("Translation button clicked");
      const result = await onTranslate();
      
      if (!result) {
        setFeedback("Please select text first");
        setTimeout(() => setFeedback(""), 2000);
      } else {
        setFeedback("Translated!");
        setTimeout(() => setFeedback(""), 1500);
      }
    } catch (error) {
      console.error("Translation error:", error);
      setFeedback("Translation failed");
      setTimeout(() => setFeedback(""), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <EnhancedButton
        onClick={handleClick}
        disabled={isLoading}
        ripple
        glow
        className="
          bg-gradient-to-r 
          from-blue-600 
          to-indigo-600 
          hover:from-blue-700 
          hover:to-indigo-700 
          disabled:from-gray-400
          disabled:to-gray-500
          text-white 
          px-6 
          py-3 
          rounded-xl 
          font-semibold 
          transition-all 
          duration-300 
          flex 
          items-center 
          space-x-3 
          shadow-lg 
          hover:shadow-xl
          hover:scale-105
          active:scale-95
          focus:outline-none
          focus:ring-3
          focus:ring-blue-500/30
          focus:ring-offset-2
          disabled:cursor-not-allowed
          disabled:hover:scale-100
          group
        "
        title="Translate selected text (Ctrl+T)"
      >
        <Languages className={`w-5 h-5 transition-transform duration-300 ${isLoading ? 'animate-spin' : 'group-hover:scale-110'}`} />
        <span>{isLoading ? 'Translating...' : 'Translate'}</span>
      </EnhancedButton>
      {feedback && (
        <div className="absolute top-full left-0 mt-3 px-4 py-3 bg-gray-900/95 text-white text-sm rounded-xl whitespace-nowrap z-10 animate-fade-in backdrop-blur-sm border border-gray-700 shadow-xl">
          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default TranslateButton;
