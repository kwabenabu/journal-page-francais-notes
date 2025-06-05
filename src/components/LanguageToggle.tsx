
import { Languages } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      title={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
    >
      <Languages className="w-4 h-4" />
      <span className="text-sm font-medium">
        {language === 'en' ? 'FR' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggle;
