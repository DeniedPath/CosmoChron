import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  TooltipProps
} from 'recharts';
import { DateRange, getWeeklyFocusData } from '@/utils/analytics/dataProcessing';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface WeeklyTrendChartProps {
  dateRange: DateRange;
}

const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({ dateRange }) => {
  // Get weekly focus data for the selected date range
  const weeklyData = useMemo(() => getWeeklyFocusData(dateRange), [dateRange]);
  
  // Calculate week-over-week changes
  const weeklyChanges = useMemo(() => {
    if (weeklyData.length < 2) return [];
    
    return weeklyData.map((week, index) => {
      if (index === 0) {
        return {
          ...week,
          change: 0,
          changePercent: 0
        };
      }
      
      const prevWeek = weeklyData[index - 1];
      const change = week.minutes - prevWeek.minutes;
      const changePercent = prevWeek.minutes === 0 
        ? 100 
        : Math.round((change / prevWeek.minutes) * 100);
      
      return {
        ...week,
        change,
        changePercent
      };
    });
  }, [weeklyData]);
  
  // Calculate average weekly minutes
  const avgWeeklyMinutes = useMemo(() => 
    weeklyData.length > 0 
      ? Math.round(weeklyData.reduce((sum, week) => sum + week.minutes, 0) / weeklyData.length)
      : 0,
    [weeklyData]
  );
  
  // Determine trend direction
  const trendDirection = useMemo(() => {
    if (weeklyData.length < 2) return 'neutral';
    
    const firstHalf = weeklyData.slice(0, Math.floor(weeklyData.length / 2));
    const secondHalf = weeklyData.slice(Math.floor(weeklyData.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, week) => sum + week.minutes, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, week) => sum + week.minutes, 0) / secondHalf.length;
    
    if (secondHalfAvg > firstHalfAvg * 1.1) return 'up';
    if (secondHalfAvg < firstHalfAvg * 0.9) return 'down';
    return 'neutral';
  }, [weeklyData]);
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="cosmic-blur p-3 rounded-md border border-cosmic-highlight/20">
          <p className="text-cosmic-white text-sm font-medium">{data.label}</p>
          <p className="text-cosmic-white/80 text-sm">
            <span className="font-medium">{payload[0].value}</span> minutes of focus time
          </p>
          {data.change !== undefined && (
            <p className={`text-sm ${data.change > 0 ? 'text-green-400' : data.change < 0 ? 'text-red-400' : 'text-cosmic-white/60'}`}>
              {data.change > 0 ? '↑' : data.change < 0 ? '↓' : '→'} {Math.abs(data.change)} min ({data.changePercent}%)
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm text-cosmic-white/70">Weekly Average</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-cosmic-white">{avgWeeklyMinutes} min</div>
            <div className="text-xs text-cosmic-white/60">
              {Math.floor(avgWeeklyMinutes / 60)} hrs {avgWeeklyMinutes % 60} min per week
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm text-cosmic-white/70">Weekly Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center">
              {trendDirection === 'up' ? (
                <>
                  <ArrowUp className="h-6 w-6 mr-2 text-green-400" />
                  <div>
                    <div className="text-xl font-bold text-green-400">Increasing</div>
                    <div className="text-xs text-cosmic-white/60">Your focus time is trending up</div>
                  </div>
                </>
              ) : trendDirection === 'down' ? (
                <>
                  <ArrowDown className="h-6 w-6 mr-2 text-red-400" />
                  <div>
                    <div className="text-xl font-bold text-red-400">Decreasing</div>
                    <div className="text-xs text-cosmic-white/60">Your focus time is trending down</div>
                  </div>
                </>
              ) : (
                <>
                  <Minus className="h-6 w-6 mr-2 text-cosmic-white/80" />
                  <div>
                    <div className="text-xl font-bold text-cosmic-white/80">Stable</div>
                    <div className="text-xs text-cosmic-white/60">Your focus time is consistent</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm text-cosmic-white/70">Consistency Score</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {weeklyData.length > 1 ? (
              <>
                <div className="text-2xl font-bold text-cosmic-white">
                  {Math.round(100 - (Math.min(100, 
                    weeklyData.reduce((variance, week, i, arr) => {
                      if (i === 0) return 0;
                      const prevWeek = arr[i - 1];
                      return variance + Math.abs((week.minutes - prevWeek.minutes) / prevWeek.minutes) * 100;
                    }, 0) / (weeklyData.length - 1)
                  )))}%
                </div>
                <div className="text-xs text-cosmic-white/60">
                  {weeklyData.length < 3 ? 'Based on limited data' : 'Based on week-to-week variance'}
                </div>
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-cosmic-white/70">Insufficient Data</div>
                <div className="text-xs text-cosmic-white/60">Need at least 2 weeks of data</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
        <CardHeader className="p-4 pb-2">
          <CardTitle>Weekly Focus Trend</CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Your focus time aggregated by week
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-[350px] w-full">
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weeklyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884d810" />
                  <XAxis 
                    dataKey="label" 
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
                  <Line 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    activeDot={{ fill: '#D946EF', strokeWidth: 0, r: 6 }}
                    name="Focus Minutes"
                  />
                </LineChart>
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
          <CardTitle>Week-over-Week Changes</CardTitle>
          <CardDescription className="text-cosmic-white/70">
            How your focus time changes from week to week
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-[350px] w-full">
            {weeklyChanges.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyChanges.slice(1)} // Skip the first week which has no change
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884d810" />
                  <XAxis 
                    dataKey="label" 
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
                      value: 'Change in Minutes', 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: '#F8F9FF',
                      opacity: 0.7,
                      fontSize: 12
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="change" 
                    name="Change" 
                    radius={[4, 4, 0, 0]}
                    fill="#8B5CF6" // Default color
                  >
                    {weeklyChanges.slice(1).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.change >= 0 ? "#4ade80" : "#ef4444"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-cosmic-white/50">
                Need at least two weeks of data to show changes
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
        <CardHeader className="p-4 pb-2">
          <CardTitle>Weekly Insights</CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Analysis of your weekly focus patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Trend Analysis</h4>
              <p className="text-cosmic-white/80 text-sm">
                {weeklyData.length < 2 ? (
                  "Insufficient data to analyze trends. Complete at least two weeks of focus sessions."
                ) : trendDirection === 'up' ? (
                  "Your focus time is increasing week over week. This positive trend indicates growing productivity habits."
                ) : trendDirection === 'down' ? (
                  "Your focus time is decreasing week over week. Consider reviewing your schedule to maintain consistency."
                ) : (
                  "Your focus time is stable week over week. This consistency indicates established productivity habits."
                )}
              </p>
            </div>
            
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Weekly Pattern</h4>
              <p className="text-cosmic-white/80 text-sm">
                {weeklyData.length === 0 ? (
                  "No focus sessions recorded in this period."
                ) : avgWeeklyMinutes < 60 ? (
                  "Your weekly focus time is relatively low. Consider setting aside dedicated focus blocks each week."
                ) : avgWeeklyMinutes < 180 ? (
                  "Your weekly focus time is moderate. For optimal productivity, aim for at least 3-5 hours of focused work per week."
                ) : avgWeeklyMinutes < 300 ? (
                  "Your weekly focus time is good. You're developing strong productivity habits."
                ) : (
                  "Your weekly focus time is excellent. You're maintaining high productivity levels consistently."
                )}
              </p>
            </div>
            
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Recommendation</h4>
              <p className="text-cosmic-white/80 text-sm">
                {weeklyData.length === 0 ? (
                  "Start with setting a weekly focus goal. Even 60 minutes per week can build momentum."
                ) : weeklyData.length < 2 ? (
                  "Continue tracking your focus sessions to establish baseline patterns for better insights."
                ) : trendDirection === 'down' ? (
                  "Your focus time is declining. Schedule regular focus blocks in your calendar to reverse this trend."
                ) : avgWeeklyMinutes < 120 ? (
                  "Try to increase your weekly focus time by adding one additional focus session each week."
                ) : weeklyChanges.some(week => week.changePercent && Math.abs(week.changePercent) > 50) ? (
                  "Your focus time varies significantly week to week. Work on establishing a more consistent routine."
                ) : (
                  "Your weekly focus patterns are strong. Consider challenging yourself with more complex tasks during your focus time."
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyTrendChart;
