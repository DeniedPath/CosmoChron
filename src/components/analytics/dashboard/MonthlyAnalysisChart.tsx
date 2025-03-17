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
  TooltipProps,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DateRange, getMonthlyFocusData } from '@/utils/analytics/dataProcessing';
import { Calendar, TrendingUp, Clock } from 'lucide-react';

interface MonthlyAnalysisChartProps {
  dateRange: DateRange;
}

const MonthlyAnalysisChart: React.FC<MonthlyAnalysisChartProps> = ({ dateRange }) => {
  // Get monthly focus data for the selected date range
  const monthlyData = useMemo(() => getMonthlyFocusData(dateRange), [dateRange]);
  
  // Calculate statistics
  const totalMonths = useMemo(() => monthlyData.length, [monthlyData]);
  
  const totalMinutes = useMemo(() => 
    monthlyData.reduce((sum, month) => sum + month.minutes, 0), 
    [monthlyData]
  );
  
  const averageMinutes = useMemo(() => 
    monthlyData.length > 0 ? Math.round(totalMinutes / monthlyData.length) : 0,
    [monthlyData, totalMinutes]
  );
  
  const bestMonth = useMemo(() => {
    if (monthlyData.length === 0) return null;
    return monthlyData.reduce((best, month) => 
      month.minutes > best.minutes ? month : best, monthlyData[0]);
  }, [monthlyData]);
  
  // Prepare data for month-by-month comparison
  const monthComparisonData = useMemo(() => {
    if (monthlyData.length <= 1) return [];
    
    return monthlyData.map((month, index) => {
      if (index === 0) {
        return {
          ...month,
          change: 0,
          changePercent: 0
        };
      }
      
      const prevMonth = monthlyData[index - 1];
      const change = month.minutes - prevMonth.minutes;
      const changePercent = prevMonth.minutes === 0 
        ? 100 
        : Math.round((change / prevMonth.minutes) * 100);
      
      return {
        ...month,
        change,
        changePercent
      };
    });
  }, [monthlyData]);
  
  // Prepare data for distribution pie chart
  const distributionData = useMemo(() => {
    if (monthlyData.length === 0) return [];
    
    return monthlyData.map(month => ({
      name: month.label,
      value: month.minutes,
      percentage: totalMinutes > 0 ? Math.round((month.minutes / totalMinutes) * 100) : 0
    }));
  }, [monthlyData, totalMinutes]);
  
  // Colors for pie chart
  const COLORS = ['#8B5CF6', '#6366F1', '#EC4899', '#F97316', '#10B981', '#3B82F6', '#EF4444', '#F59E0B'];
  
  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="cosmic-blur p-3 rounded-md border border-cosmic-highlight/20">
          <p className="text-cosmic-white text-sm font-medium">{data.label || data.name}</p>
          <p className="text-cosmic-white/80 text-sm">
            <span className="font-medium">{payload[0].value}</span> minutes of focus time
          </p>
          {data.percentage !== undefined && (
            <p className="text-cosmic-white/80 text-sm">
              {data.percentage}% of total focus time
            </p>
          )}
          {data.change !== undefined && data.change !== 0 && (
            <p className={`text-sm ${data.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.change > 0 ? '↑' : '↓'} {Math.abs(data.change)} min ({data.changePercent}%)
            </p>
          )}
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
              <Calendar className="h-4 w-4 mr-1 text-cosmic-highlight/80" />
              Total Months
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-cosmic-white">{totalMonths}</div>
            <div className="text-xs text-cosmic-white/60">
              months analyzed
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm text-cosmic-white/70 flex items-center">
              <Clock className="h-4 w-4 mr-1 text-cosmic-highlight/80" />
              Monthly Average
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-cosmic-white">{averageMinutes} min</div>
            <div className="text-xs text-cosmic-white/60">
              {Math.floor(averageMinutes / 60)} hrs {averageMinutes % 60} min per month
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm text-cosmic-white/70 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-cosmic-highlight/80" />
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
              <Calendar className="h-4 w-4 mr-1 text-cosmic-highlight/80" />
              Best Month
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {bestMonth ? (
              <>
                <div className="text-2xl font-bold text-cosmic-white">{bestMonth.minutes} min</div>
                <div className="text-xs text-cosmic-white/60">
                  {bestMonth.label}
                </div>
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-cosmic-white/70">No Data</div>
                <div className="text-xs text-cosmic-white/60">No focus sessions recorded</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle>Monthly Focus Distribution</CardTitle>
            <CardDescription className="text-cosmic-white/70">
              Your focus time distribution across months
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-[350px] w-full">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
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
            <CardTitle>Monthly Focus Breakdown</CardTitle>
            <CardDescription className="text-cosmic-white/70">
              Percentage of focus time per month
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-[350px] w-full">
              {distributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-cosmic-white/50">
                  No focus sessions found in the selected date range
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
        <CardHeader className="p-4 pb-2">
          <CardTitle>Month-over-Month Comparison</CardTitle>
          <CardDescription className="text-cosmic-white/70">
            How your focus time changes from month to month
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-[350px] w-full">
            {monthComparisonData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthComparisonData.slice(1)} // Skip the first month which has no change
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
                    name="Change in Minutes"
                    radius={[4, 4, 0, 0]}
                    fill={(data) => data.change >= 0 ? "#4ade80" : "#f87171"}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-cosmic-white/50">
                Need at least two months of data to show changes
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
        <CardHeader className="p-4 pb-2">
          <CardTitle>Monthly Insights</CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Analysis of your monthly focus patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Monthly Pattern</h4>
              <p className="text-cosmic-white/80 text-sm">
                {monthlyData.length === 0 ? (
                  "No focus sessions recorded in this period."
                ) : monthlyData.length === 1 ? (
                  `You've recorded ${monthlyData[0].minutes} minutes of focus time in ${monthlyData[0].label}. Continue tracking to see month-to-month patterns.`
                ) : bestMonth && bestMonth.minutes > averageMinutes * 1.5 ? (
                  `Your best month (${bestMonth.label}) shows significantly higher focus time than your average. Consider what factors contributed to this success.`
                ) : monthComparisonData.length > 1 && monthComparisonData.slice(1).every(month => month.change >= 0) ? (
                  "Your focus time has been consistently increasing month over month. You're building excellent productivity habits!"
                ) : monthComparisonData.length > 1 && monthComparisonData.slice(1).every(month => month.change <= 0) ? (
                  "Your focus time has been consistently decreasing month over month. Consider what factors may be affecting your productivity."
                ) : (
                  "Your monthly focus time shows some variability. Look for patterns in your most productive months to replicate those conditions."
                )}
              </p>
            </div>
            
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Distribution Analysis</h4>
              <p className="text-cosmic-white/80 text-sm">
                {distributionData.length === 0 ? (
                  "No focus sessions recorded in this period."
                ) : distributionData.length === 1 ? (
                  "You only have data for one month. Continue tracking to see distribution patterns."
                ) : distributionData.some(month => month.percentage > 40) ? (
                  "Your focus time is concentrated in a few months. Consider establishing more consistent habits throughout the year."
                ) : distributionData.every(month => Math.abs(month.percentage - (100 / distributionData.length)) < 10) ? (
                  "Your focus time is very evenly distributed across months, showing consistent productivity habits."
                ) : (
                  "Your focus time varies somewhat across months. External factors like seasons or work cycles may be influencing your productivity."
                )}
              </p>
            </div>
            
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Recommendation</h4>
              <p className="text-cosmic-white/80 text-sm">
                {monthlyData.length === 0 ? (
                  "Start tracking your focus sessions to build monthly data for better insights."
                ) : monthlyData.length < 3 ? (
                  "Continue tracking your focus sessions across multiple months to establish meaningful patterns."
                ) : averageMinutes < 120 ? (
                  "Your monthly average is relatively low. Try setting a monthly focus goal to increase your productivity."
                ) : monthComparisonData.length > 1 && monthComparisonData.slice(1).some(month => month.change < 0 && month.changePercent < -30) ? (
                  "You have some months with significant drops in focus time. Review what happened during those periods to identify potential obstacles."
                ) : bestMonth && bestMonth.minutes > averageMinutes * 1.5 ? (
                  `Analyze what made ${bestMonth.label} your most productive month and try to replicate those conditions.`
                ) : (
                  "Your monthly focus patterns are solid. Consider setting progressive monthly goals to continue improving your productivity."
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyAnalysisChart;
