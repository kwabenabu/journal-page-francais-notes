
import { Award } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { WritingStats } from "../../services/profileService";

interface EvaluationChartProps {
  stats: WritingStats[];
}

const EvaluationChart = ({ stats }: EvaluationChartProps) => {
  const prepareChartData = () => {
    return stats
      .filter(stat => stat.total_accuracy_score > 0)
      .slice(0, 7)
      .reverse()
      .map(stat => ({
        date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: Math.round(stat.total_accuracy_score)
      }));
  };

  const chartConfig = {
    score: {
      label: "Accuracy Score",
      color: "hsl(var(--chart-1))"
    }
  };

  return (
    <div className="chrome-metallic rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Evaluation Score Trend</h3>
      {prepareChartData().length > 0 ? (
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={prepareChartData()}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: "#8b5cf6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Award className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No evaluation scores yet</p>
            <p className="text-sm">Write entries and get them reviewed to see your progress!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationChart;
