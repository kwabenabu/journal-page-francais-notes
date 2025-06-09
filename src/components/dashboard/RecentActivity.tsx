
import { WritingStats } from "../../services/profileService";

interface RecentActivityProps {
  stats: WritingStats[];
}

const RecentActivity = ({ stats }: RecentActivityProps) => {
  return (
    <div className="chrome-metallic rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {stats.slice(0, 7).map((stat, index) => (
          <div key={stat.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-800">
                  {new Date(stat.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {stat.entries_written} entries • {stat.word_count} words
                </p>
              </div>
            </div>
            {stat.total_accuracy_score > 0 && (
              <div className="text-right">
                <p className="text-sm font-medium text-purple-600">
                  {Math.round(stat.total_accuracy_score)}% accuracy
                </p>
              </div>
            )}
          </div>
        ))}
        {stats.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No writing activity yet.</p>
            <p className="text-sm">Start writing to see your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
