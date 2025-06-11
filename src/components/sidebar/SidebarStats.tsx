
import { TrendingUp, Target, Flame, BookOpen, Calendar, Award } from "lucide-react";
import { JournalEntry } from "../../services/journalService";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface SidebarStatsProps {
  entries: JournalEntry[];
  drafts: JournalEntry[];
}

const SidebarStats = ({ entries, drafts }: SidebarStatsProps) => {
  const totalEntries = entries.length;
  const totalWords = entries.reduce((sum, entry) => 
    sum + (entry.content.trim() ? entry.content.trim().split(/\s+/).length : 0), 0
  );
  const averageScore = entries.length > 0 
    ? Math.round(entries.reduce((sum, entry) => sum + (entry.french_accuracy_score || 0), 0) / entries.length)
    : 0;
  
  // Calculate streak (consecutive days with entries)
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const hasEntry = entries.some(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate.toDateString() === checkDate.toDateString();
    });
    if (hasEntry) {
      streak++;
    } else {
      break;
    }
  }

  const thisWeekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  }).length;

  return (
    <div className="space-y-4 p-4">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-blue-800 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Your Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-blue-200/50 text-center hover:scale-105 transition-transform duration-200">
              <div className="text-2xl font-bold text-blue-700">{totalEntries}</div>
              <div className="text-xs text-blue-600 font-medium">Entries</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-emerald-200/50 text-center hover:scale-105 transition-transform duration-200">
              <div className="text-2xl font-bold text-emerald-700">{totalWords}</div>
              <div className="text-xs text-emerald-600 font-medium">Words</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-orange-700">{streak}</div>
                <div className="text-xs text-orange-600 font-medium">Day Streak</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">This week</div>
              <div className="text-lg font-bold text-gray-800">{thisWeekEntries}/7</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {averageScore > 0 && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-purple-700">{averageScore}/100</div>
                <div className="text-xs text-purple-600 font-medium">Average Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-700">Weekly Goal</div>
            <div className="text-sm text-green-600 mb-3">Write 5 entries this week</div>
            <div className="w-full bg-green-100 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((thisWeekEntries / 5) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-green-600 font-medium">
              {thisWeekEntries}/5 completed
            </div>
          </div>
        </CardContent>
      </Card>

      {drafts.length > 0 && (
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-amber-700">{drafts.length}</div>
                <div className="text-xs text-amber-600 font-medium">Drafts to finish</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SidebarStats;
