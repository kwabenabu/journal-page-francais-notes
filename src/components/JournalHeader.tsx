
import { BookOpen, PenTool } from "lucide-react";

interface JournalHeaderProps {
  onNewEntry: () => void;
}

const JournalHeader = ({ onNewEntry }: JournalHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-amber-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 font-serif">Mon Journal</h1>
              <p className="text-amber-700 font-light">Mes pensées et réflexions</p>
            </div>
          </div>
          <button
            onClick={onNewEntry}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <PenTool className="w-5 h-5" />
            <span>Nouvelle entrée</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default JournalHeader;
