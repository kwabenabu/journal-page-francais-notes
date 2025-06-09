
import { useState } from "react";
import { Languages } from "lucide-react";

interface TranslateButtonProps {
  onTranslate: () => Promise<boolean> | boolean;
}

const TranslateButton = ({ onTranslate }: TranslateButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  const handleClick = async () => {
    setIsPressed(true);
    setFeedback("");
    
    try {
      console.log("Translation button clicked");
      const result = await onTranslate();
      
      if (!result) {
        setFeedback("Please select text first");
        setTimeout(() => setFeedback(""), 2000);
      }
    } catch (error) {
      console.error("Translation error:", error);
      setFeedback("Translation failed");
      setTimeout(() => setFeedback(""), 2000);
    }
    
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`
          interactive-button
          bg-gradient-to-r 
          from-blue-600 
          to-indigo-600 
          hover:from-blue-700 
          hover:to-indigo-700 
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
          ${isPressed ? 'scale-95 shadow-md' : ''}
          disabled:bg-gray-300 disabled:cursor-not-allowed
        `}
        title="Translate selected text (Ctrl+T)"
      >
        <Languages className="w-5 h-5" />
        <span>Translate</span>
      </button>
      {feedback && (
        <div className="absolute top-full left-0 mt-3 px-4 py-3 bg-gray-900/90 text-white text-sm rounded-xl whitespace-nowrap z-10 animate-fade-in backdrop-blur-sm border border-gray-700 shadow-lg">
          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default TranslateButton;
