
import { useState } from "react";

interface TranslateButtonProps {
  onTranslate: () => void;
}

const TranslateButton = ({ onTranslate }: TranslateButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    onTranslate();
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
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
  );
};

export default TranslateButton;
