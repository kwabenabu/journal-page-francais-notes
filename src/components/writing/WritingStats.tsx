
import { TrendingUp, Target, Clock } from "lucide-react";

interface WritingStatsProps {
  content: string;
  showStats: boolean;
  onStatsMouseEnter: () => void;
  onStatsMouseLeave: () => void;
}

const WritingStats = ({
  content,
  showStats,
  onStatsMouseEnter,
  onStatsMouseLeave
}: WritingStatsProps) => {
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const characterCount = content.length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <>
      {/* Enhanced floating stats with smart visibility */}
      <div 
        className={`absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl border border-gray-200/70 text-sm text-gray-600 shadow-xl hover:shadow-2xl transition-all duration-500 ${
          showStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        onMouseEnter={onStatsMouseEnter}
        onMouseLeave={onStatsMouseLeave}
      >
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 group hover:scale-105 transition-transform duration-200">
            <TrendingUp className="w-4 h-4 text-blue-500 group-hover:rotate-12 transition-transform duration-200" />
            <span className="font-bold text-blue-700">{wordCount} words</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center space-x-2 group hover:scale-105 transition-transform duration-200">
            <Target className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-bold text-green-700">{characterCount} chars</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center space-x-2 group hover:scale-105 transition-transform duration-200">
            <Clock className="w-4 h-4 text-purple-500 group-hover:rotate-12 transition-transform duration-200" />
            <span className="font-bold text-purple-700">{readingTime} min</span>
          </div>
        </div>
      </div>
      
      {/* Invisible hover zone for stats when hidden */}
      {!showStats && (
        <div 
          className="absolute bottom-0 right-0 w-32 h-20 cursor-pointer"
          onMouseEnter={onStatsMouseEnter}
          title="Hover to show writing stats"
        />
      )}
    </>
  );
};

export default WritingStats;
