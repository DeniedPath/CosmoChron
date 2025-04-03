import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { DateRange, getDailyFocusData } from '@/utils/analytics/dataProcessing';
import { Activity, Clock, Calendar } from 'lucide-react';

interface DailyFocusChartProps {
  dateRange: DateRange;
}

const DailyFocusChart: React.FC<DailyFocusChartProps> = ({ dateRange }) => {
  // Get daily focus data for the selected date range
  const dailyData = useMemo(() => getDailyFocusData(dateRange), [dateRange]);
  
  // Calculate statistics
  const totalMinutes = useMemo(() => 
    dailyData.reduce((sum, day) => sum + day.minutes, 0), 
    [dailyData]
  );
  
  const averageMinutes = useMemo(() => 
    dailyData.length > 0 ? Math.round(totalMinutes / dailyData.length) : 0,
    [dailyData, totalMinutes]
  );
  
  const maxMinutes = useMemo(() => 
    dailyData.length > 0 ? Math.max(...dailyData.map(day => day.minutes)) : 0,
    [dailyData]
  );
  
  const activeDays = useMemo(() => 
    dailyData.filter(day => day.minutes > 0).length,
    [dailyData]
  );
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="cosmic-blur p-3 rounded-md border border-cosmic-highlight/20">
          <p className="text-cosmic-white text-sm font-medium">{data.formattedDate}</p>
          <p className="text-cosmic-white/80 text-sm">
            <span className="font-medium">{payload[0].value}</span> minutes of focus time
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm text-cosmic-white/70 flex items-center">
              <Clock className="h-4 w-4 mr-1 text-cosmic-highlight/80" />
              Total Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-cosmic-white">{totalMinutes} min</div>
            <div className="text-xs text-cosmic-white/60">
              {Math.floor(totalMinutes / 60)} hrs {totalMinutes % 60} min
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm text-cosmic-white/70 flex items-center">
              <Activity className="h-4 w-4 mr-1 text-cosmic-highlight/80" />
              Daily Average
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-cosmic-white">{averageMinutes} min</div>
            <div className="text-xs text-cosmic-white/60">per day</div>
          </CardContent>
        </Card>
        
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm text-cosmic-white/70 flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-cosmic-highlight/80" />
              Active Days
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-cosmic-white">{activeDays}</div>
            <div className="text-xs text-cosmic-white/60">
              of {dailyData.length} days ({Math.round((activeDays / dailyData.length) * 100)}%)
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm text-cosmic-white/70 flex items-center">
              <Activity className="h-4 w-4 mr-1 text-cosmic-highlight/80" />
              Best Day
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-cosmic-white">{maxMinutes} min</div>
            <div className="text-xs text-cosmic-white/60">
              {maxMinutes > 0 
                ? dailyData.find(day => day.minutes === maxMinutes)?.formattedDate 
                : 'No focus sessions'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
        <CardHeader className="p-4 pb-2">
          <CardTitle>Daily Focus Distribution</CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Your focus time for each day in the selected period
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-[350px] w-full">
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884d810" />
                  <XAxis 
                    dataKey="formattedDate" 
                    tick={{ fill: '#F8F9FF', opacity: 0.7, fontSize: 12 }}
                    axisLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fill: '#F8F9FF', opacity: 0.7, fontSize: 12 }}
                    axisLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
                    tickLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
                    label={{ 
                      value: 'Minutes', 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: '#F8F9FF',
                      opacity: 0.7,
                      fontSize: 12
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="minutes" 
                    fill="#6E56CF" 
                    radius={[4, 4, 0, 0]}
                    name="Focus Minutes"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-cosmic-white/50">
                No focus sessions found in the selected date range
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
        <CardHeader className="p-4 pb-2">
          <CardTitle>Daily Focus Insights</CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Analysis of your daily focus patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Focus Pattern</h4>
              <p className="text-cosmic-white/80 text-sm">
                {activeDays === 0 ? (
                  "No focus sessions recorded in this period. Start your focus journey to see insights."
                ) : activeDays / dailyData.length < 0.3 ? (
                  "Your focus sessions are infrequent. Consider establishing a more regular focus routine."
                ) : activeDays / dailyData.length < 0.7 ? (
                  "You have a moderate focus routine. Try to increase consistency for better results."
                ) : (
                  "You have a consistent focus routine. Great job maintaining regular sessions!"
                )}
              </p>
            </div>
            
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Duration Analysis</h4>
              <p className="text-cosmic-white/80 text-sm">
                {averageMinutes === 0 ? (
                  "No completed focus sessions in this period."
                ) : averageMinutes < 15 ? (
                  "Your average session is quite short. Consider extending your focus periods for deeper work."
                ) : averageMinutes < 30 ? (
                  "Your average session is good for quick tasks. For complex work, aim for 30+ minute sessions."
                ) : averageMinutes < 60 ? (
                  "Your average session duration is ideal for deep work. Keep up the good focus habits!"
                ) : (
                  "Your average session is excellent for deep work. You're mastering extended focus periods!"
                )}
              </p>
            </div>
            
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Recommendation</h4>
              <p className="text-cosmic-white/80 text-sm">
                {activeDays === 0 ? (
                  "Start with short, regular focus sessions to build your productivity habit."
                ) : totalMinutes / dailyData.length < 30 ? (
                  "Try to increase your daily focus time to at least 30 minutes for better productivity."
                ) : activeDays / dailyData.length < 0.5 ? (
                  "Focus on consistency. Schedule regular focus sessions, even if they're short."
                ) : maxMinutes > averageMinutes * 2 ? (
                  "Your focus time varies significantly. Try to maintain more consistent daily focus periods."
                ) : (
                  "Your focus habits are strong. Consider challenging yourself with slightly longer sessions or more complex tasks."
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyFocusChart;
