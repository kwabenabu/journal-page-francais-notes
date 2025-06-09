
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
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
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
    <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6 shadow-sm animate-fade-in">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white border-b border-blue-100 -mx-6 -mt-6 px-6 py-4 mb-6 rounded-t-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
            <span className="font-serif">Évaluation Français</span>
          </h3>
          
          {hasReview && entry.reviewed_at && (
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg border font-bold text-lg ${getScoreColor(entry.french_accuracy_score!)}`}>
                {entry.french_accuracy_score}/100
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {formatDate(entry.reviewed_at)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      {!isReviewing && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => onRequestReview(entry.id, entry.content)}
            disabled={isReviewing}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <RefreshCw className={`w-5 h-5 ${isReviewing ? 'animate-spin' : ''}`} />
            <span>{hasReview ? 'New Evaluation' : 'Request Evaluation'}</span>
          </button>
        </div>
      )}

      {isReviewing && (
        <div className="flex items-center justify-center space-x-3 text-indigo-600 mb-8 py-8">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Analyzing your French...</span>
        </div>
      )}

      {hasReview ? (
        <div className="space-y-6">
          {entry.language_feedback && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 animate-scale-in">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-3 text-lg font-serif">
                    Improvement Suggestions
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {entry.language_feedback}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-10 h-10 text-blue-400" />
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2 font-serif">Ready for Evaluation</h4>
          <p className="text-gray-500">
            This entry hasn't been evaluated yet.
            <br />
            Click "Request Evaluation" to get personalized feedback on your French writing.
          </p>
        </div>
      )}
    </div>
  );
};

export default FrenchReview;
