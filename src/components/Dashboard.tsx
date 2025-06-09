
import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Calendar, Target, Award } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { profileService, WritingStats, UserProfile } from "../services/profileService";
import { journalService } from "../services/journalService";

const Dashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<WritingStats[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResult, profileResult, entriesResult] = await Promise.all([
        profileService.getWritingStats(),
        profileService.getProfile(),
        journalService.getEntries()
      ]);

      if (statsResult.data) setStats(statsResult.data);
      if (profileResult.data) setProfile(profileResult.data);
      if (entriesResult.data) setTotalEntries(entriesResult.data.length);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStreak = () => {
    if (stats.length === 0) return 0;
    return stats[0]?.streak_count || 0;
  };

  const getTotalWords = () => {
    return stats.reduce((total, stat) => total + (stat.word_count || 0), 0);
  };

  const getAverageAccuracy = () => {
    const validStats = stats.filter(stat => stat.total_accuracy_score > 0);
    if (validStats.length === 0) return 0;
    const total = validStats.reduce((sum, stat) => sum + stat.total_accuracy_score, 0);
    return Math.round(total / validStats.length);
  };

  const getThisWeekEntries = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return stats.filter(stat => new Date(stat.date) >= oneWeekAgo)
                .reduce((total, stat) => total + stat.entries_written, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen chrome-gradient flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen chrome-gradient">
      <div className="relative z-10 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center">
            <BarChart3 className="w-8 h-8 text-amber-600 mr-3" />
            <h1 className="text-2xl font-serif font-bold text-gray-800">Writing Dashboard</h1>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="chrome-metallic rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-3xl font-bold text-amber-600">{getCurrentStreak()}</p>
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
                  <p className="text-3xl font-bold text-green-600">{getTotalWords().toLocaleString()}</p>
                  <p className="text-xs text-gray-500">written</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="chrome-metallic rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Accuracy</p>
                  <p className="text-3xl font-bold text-purple-600">{getAverageAccuracy()}%</p>
                  <p className="text-xs text-gray-500">french score</p>
                </div>
                <Award className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Recent Activity & Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Writing Activity */}
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

            {/* Writing Goals & Progress */}
            <div className="chrome-metallic rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Goals & Progress</h3>
              
              <div className="space-y-6">
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
                        width: `${Math.min(100, ((stats[0]?.word_count || 0) / (profile?.writing_goal || 300)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats[0]?.word_count || 0} words today
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

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
