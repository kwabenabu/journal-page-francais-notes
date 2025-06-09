
import { Calendar, TrendingUp, Target, Award } from "lucide-react";

interface StatsCardsProps {
  currentStreak: number;
  totalEntries: number;
  totalWords: number;
  averageAccuracy: number;
}

const StatsCards = ({ currentStreak, totalEntries, totalWords, averageAccuracy }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="chrome-metallic rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Current Streak</p>
            <p className="text-3xl font-bold text-amber-600">{currentStreak}</p>
            <p className="text-xs text-gray-500">days</p>
          </div>
          <Calendar className="w-8 h-8 text-amber-600" />
        </div>
      </div>

      <div className="chrome-metallic rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Entries</p>
            <p className="text-3xl font-bold text-blue-600">{totalEntries}</p>
            <p className="text-xs text-gray-500">all time</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="chrome-metallic rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Words</p>
            <p className="text-3xl font-bold text-green-600">{totalWords.toLocaleString()}</p>
            <p className="text-xs text-gray-500">written</p>
          </div>
          <Target className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="chrome-metallic rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg. Accuracy</p>
            <p className="text-3xl font-bold text-purple-600">{averageAccuracy}%</p>
            <p className="text-xs text-gray-500">french score</p>
          </div>
          <Award className="w-8 h-8 text-purple-600" />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
