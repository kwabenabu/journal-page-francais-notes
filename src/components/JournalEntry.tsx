
import { Calendar, Edit3 } from "lucide-react";

interface JournalEntryProps {
  id: string;
  title: string;
  content: string;
  date: string;
  onEdit: (id: string) => void;
}

const JournalEntry = ({ id, title, content, date, onEdit }: JournalEntryProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="bg-white border border-amber-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2 text-amber-600">
          <Calendar className="w-4 h-4" />
          <time className="text-sm font-medium">{formatDate(date)}</time>
        </div>
        <button
          onClick={() => onEdit(id)}
          className="text-gray-400 hover:text-amber-600 transition-colors duration-200 p-1 rounded-full hover:bg-amber-50"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
      
      <h2 className="text-xl font-serif font-semibold text-gray-800 mb-3 leading-relaxed">
        {title}
      </h2>
      
      <div className="prose prose-amber max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {content.length > 200 ? `${content.substring(0, 200)}...` : content}
        </p>
      </div>
      
      {content.length > 200 && (
        <button
          onClick={() => onEdit(id)}
          className="mt-3 text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors duration-200"
        >
          Lire la suite →
        </button>
      )}
    </article>
  );
};

export default JournalEntry;
