
import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { profileService, WritingStats, UserProfile } from "../services/profileService";
import { journalService } from "../services/journalService";
import StatsCards from "./dashboard/StatsCards";
import EvaluationChart from "./dashboard/EvaluationChart";
import RecentActivity from "./dashboard/RecentActivity";
import GoalsProgress from "./dashboard/GoalsProgress";

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

  const getTodayWords = () => {
    const today = new Date().toDateString();
    const todayStat = stats.find(stat => new Date(stat.date).toDateString() === today);
    return todayStat?.word_count || 0;
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
          <StatsCards
            currentStreak={getCurrentStreak()}
            totalEntries={totalEntries}
            totalWords={getTotalWords()}
            averageAccuracy={getAverageAccuracy()}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EvaluationChart stats={stats} />
            <RecentActivity stats={stats} />
          </div>

          <GoalsProgress
            profile={profile}
            stats={stats}
            getTodayWords={getTodayWords}
            getThisWeekEntries={getThisWeekEntries}
            getCurrentStreak={getCurrentStreak}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
