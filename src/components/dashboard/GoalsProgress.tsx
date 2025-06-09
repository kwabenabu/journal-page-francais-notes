
import { WritingStats, UserProfile } from "../../services/profileService";

interface GoalsProgressProps {
  profile: UserProfile | null;
  stats: WritingStats[];
  getTodayWords: () => number;
  getThisWeekEntries: () => number;
  getCurrentStreak: () => number;
}

const GoalsProgress = ({ profile, stats, getTodayWords, getThisWeekEntries, getCurrentStreak }: GoalsProgressProps) => {
  return (
    <div className="mt-8">
      <div className="chrome-metallic rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Goals & Progress</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Daily Goal</span>
              <span className="text-sm text-gray-500">
                {profile?.writing_goal || 300} words
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (getTodayWords() / (profile?.writing_goal || 300)) * 100)}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getTodayWords()} words today
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">This Week</span>
              <span className="text-sm text-gray-500">
                {getThisWeekEntries()} entries
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (getThisWeekEntries() / 7) * 100)}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Target: 7 entries per week
            </p>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2">Keep it up! 🎉</h4>
          <p className="text-sm text-amber-700">
            {getCurrentStreak() > 0 
              ? `You're on a ${getCurrentStreak()}-day writing streak!`
              : "Start your writing streak today!"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoalsProgress;
