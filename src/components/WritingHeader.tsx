
import { BookOpen, FileText, LogOut } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";

interface WritingHeaderProps {
  userEmail: string;
  onNewEntry: () => void;
  onSignOut: () => void;
}

const WritingHeader = ({ userEmail, onNewEntry, onSignOut }: WritingHeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-amber-600" />
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-800">{t('journal.title')}</h1>
            <p className="text-sm text-gray-600">{t('journal.welcome')}, {userEmail}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <button
            onClick={onNewEntry}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FileText className="w-5 h-5" />
            <span>{t('journal.newEntry')}</span>
          </button>
          <button
            onClick={onSignOut}
            className="text-gray-600 hover:text-gray-800 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default WritingHeader;
