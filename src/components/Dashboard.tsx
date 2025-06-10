
import { useState, useEffect } from "react";
import { Calendar, TrendingUp, Target, Award } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { profileService, WritingStats, UserProfile } from "../services/profileService";
import { journalService } from "../services/journalService";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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

  const getTodayWords = () => {
    const today = new Date().toDateString();
    const todayStat = stats.find(stat => new Date(stat.date).toDateString() === today);
    return todayStat?.word_count || 0;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">
              {getCurrentStreak()}
            </CardTitle>
            <Calendar className="h-8 w-8 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-amber-700">days</div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              {totalEntries}
            </CardTitle>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-blue-700">all time</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              {getTotalWords()}
            </CardTitle>
            <Target className="h-8 w-8 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-700">written</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              {getAverageAccuracy()}%
            </CardTitle>
            <Award className="h-8 w-8 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-purple-700">french score</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Evaluation Score Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <Award className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-lg font-medium">No evaluation scores yet</p>
              <p className="text-sm text-muted-foreground">
                Write entries and get them reviewed to see your progress!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-lg font-medium">No writing activity yet.</p>
              <p className="text-sm text-muted-foreground">
                Start writing to see your progress!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Goals & Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Daily Goal</span>
                <span className="text-sm text-muted-foreground">300 words</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {getTodayWords()} words today
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">This Week</span>
                <span className="text-sm text-muted-foreground">0 entries</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Target: 7 entries per week
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎯</span>
              <span className="text-sm font-medium text-amber-800">Keep it up!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
