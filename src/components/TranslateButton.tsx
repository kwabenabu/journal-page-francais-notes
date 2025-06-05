
import { useState } from "react";

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
          bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium 
          transition-all duration-200 flex items-center space-x-2 
          ${isPressed ? 'scale-95 bg-blue-800' : ''}
          disabled:bg-gray-300 disabled:cursor-not-allowed
        `}
        title="Translate selected text (Ctrl+T)"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
          />
        </svg>
        <span>Translate</span>
      </button>
      {feedback && (
        <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
          {feedback}
        </div>
      )}
    </div>
  );
};

export default TranslateButton;
