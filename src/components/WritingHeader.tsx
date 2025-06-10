
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
    <header className="bg-background border-b border-border px-6 py-4 sticky top-0 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">{t('journal.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('journal.welcome')}, {userEmail}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageToggle />
          <button
            onClick={onNewEntry}
            className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FileText className="w-5 h-5" />
            <span>{t('journal.newEntry')}</span>
          </button>
          <button
            onClick={onSignOut}
            className="text-muted-foreground hover:text-foreground p-3 rounded-lg hover:bg-accent transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default WritingHeader;
