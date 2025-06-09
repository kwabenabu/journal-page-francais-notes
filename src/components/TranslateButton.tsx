
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
          bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium 
          transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg
          transform hover:-translate-y-0.5
          ${isPressed ? 'scale-95 bg-blue-800' : ''}
          disabled:bg-gray-300 disabled:cursor-not-allowed
        `}
        title="Translate selected text (Ctrl+T)"
      >
        <Languages className="w-5 h-5" />
        <span>Translate</span>
      </button>
      {feedback && (
        <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-10 animate-fade-in">
          {feedback}
        </div>
      )}
    </div>
  );
};

export default TranslateButton;
