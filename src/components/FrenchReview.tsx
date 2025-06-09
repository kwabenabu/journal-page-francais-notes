
import { Clock, Star, MessageSquare, RefreshCw } from "lucide-react";
import { JournalEntry } from "../services/journalService";

interface FrenchReviewProps {
  entry: JournalEntry;
  onRequestReview: (entryId: string, content: string) => void;
  isReviewing?: boolean;
}

const FrenchReview = ({ entry, onRequestReview, isReviewing = false }: FrenchReviewProps) => {
  const hasReview = entry.french_accuracy_score !== null && entry.french_accuracy_score !== undefined;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Star className="w-5 h-5 mr-2 text-amber-500" />
          Évaluation Français
        </h3>
        
        {!isReviewing && (
          <button
            onClick={() => onRequestReview(entry.id, entry.content)}
            disabled={isReviewing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isReviewing ? 'animate-spin' : ''}`} />
            <span>{hasReview ? 'Nouvelle évaluation' : 'Demander une évaluation'}</span>
          </button>
        )}
      </div>

      {isReviewing && (
        <div className="flex items-center space-x-2 text-blue-600 mb-4">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Analyse en cours...</span>
        </div>
      )}

      {hasReview ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-2 rounded-lg ${getScoreColor(entry.french_accuracy_score!)}`}>
              <span className="text-lg font-bold">{entry.french_accuracy_score}/100</span>
            </div>
            
            {entry.reviewed_at && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Évalué le {formatDate(entry.reviewed_at)}
              </div>
            )}
          </div>

          {entry.language_feedback && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Suggestions d'amélioration</h4>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {entry.language_feedback}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Cette entrée n'a pas encore été évaluée.
            <br />
            Cliquez sur "Demander une évaluation" pour obtenir des suggestions d'amélioration.
          </p>
        </div>
      )}
    </div>
  );
};

export default FrenchReview;
