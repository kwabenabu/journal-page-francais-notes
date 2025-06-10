
import { Calendar, Edit3, Star } from "lucide-react";

interface JournalEntryProps {
  id: string;
  title: string;
  content: string;
  date: string;
  frenchScore?: number | null;
  onEdit: (id: string) => void;
}

const JournalEntry = ({ id, title, content, date, frenchScore, onEdit }: JournalEntryProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900";
    if (score >= 60) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900";
    return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900";
  };

  return (
    <article className="
      bg-card 
      border 
      border-border 
      rounded-2xl 
      p-6 
      shadow-sm 
      transition-all 
      duration-[250ms] 
      ease-[cubic-bezier(.25,.8,.25,1)]
      hover:scale-[1.02] 
      hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] 
      hover:bg-accent/50
      focus-within:scale-[1.02] 
      focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.1)]
      focus-within:bg-accent/50
      motion-reduce:transition-none
      motion-reduce:hover:transform-none
      motion-reduce:focus-within:transform-none
    ">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
          <Calendar className="w-4 h-4" />
          <time className="text-sm font-medium">{formatDate(date)}</time>
        </div>
        <div className="flex items-center space-x-2">
          {frenchScore !== null && frenchScore !== undefined && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getScoreColor(frenchScore)}`}>
              <Star className="w-3 h-3" />
              <span>{frenchScore}/100</span>
            </div>
          )}
          <button
            onClick={() => onEdit(id)}
            className="
              text-muted-foreground 
              hover:text-amber-600 
              focus:text-amber-600
              dark:hover:text-amber-400
              dark:focus:text-amber-400
              transition-colors 
              duration-[250ms] 
              ease-[cubic-bezier(.25,.8,.25,1)]
              p-2 
              rounded-full 
              hover:bg-amber-50
              focus:bg-amber-50
              dark:hover:bg-amber-900/50
              dark:focus:bg-amber-900/50
              focus:outline-none
              focus:ring-2
              focus:ring-amber-500
              focus:ring-offset-2
            "
            aria-label="Modifier cette entrée"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h2 className="text-xl font-serif font-semibold text-card-foreground mb-3 leading-relaxed">
        {title}
      </h2>
      
      <div className="prose prose-amber max-w-none dark:prose-invert">
        <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
          {content.length > 200 ? `${content.substring(0, 200)}...` : content}
        </p>
      </div>
      
      {content.length > 200 && (
        <button
          onClick={() => onEdit(id)}
          className="
            mt-3 
            text-amber-600 
            hover:text-amber-700 
            focus:text-amber-700
            dark:text-amber-400
            dark:hover:text-amber-300
            dark:focus:text-amber-300
            text-sm 
            font-medium 
            transition-colors 
            duration-[250ms] 
            ease-[cubic-bezier(.25,.8,.25,1)]
            focus:outline-none
            focus:underline
            underline-offset-2
          "
        >
          Lire la suite →
        </button>
      )}
    </article>
  );
};

export default JournalEntry;
