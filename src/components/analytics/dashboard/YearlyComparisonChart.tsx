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
  LineChart,
  Line,
  Legend
} from 'recharts';
import { DateRange, getYearlyFocusData, getYearlyComparisonData } from '@/utils/analytics/dataProcessing';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface YearlyComparisonChartProps {
  dateRange: DateRange;
}

const YearlyComparisonChart: React.FC<YearlyComparisonChartProps> = ({ dateRange }) => {
  // Get yearly focus data for the selected date range
  const yearlyData = useMemo(() => getYearlyFocusData(dateRange), [dateRange]);
  
  // Get year-over-year comparison data
  const comparisonData = useMemo(() => getYearlyComparisonData(dateRange), [dateRange]);
  
  // Calculate statistics
  const totalYears = useMemo(() => yearlyData.length, [yearlyData]);
  
  const totalMinutes = useMemo(() => 
    yearlyData.reduce((sum, year) => sum + year.minutes, 0), 
    [yearlyData]
  );
  
  const bestYear = useMemo(() => {
    if (yearlyData.length === 0) return null;
    return yearlyData.reduce((best, year) => 
      year.minutes > best.minutes ? year : best, yearlyData[0]);
  }, [yearlyData]);
  
  // Calculate year-over-year growth
  const yearOverYearGrowth = useMemo(() => {
    if (yearlyData.length < 2) return null;
    
    const currentYear = yearlyData[yearlyData.length - 1];
    const previousYear = yearlyData[yearlyData.length - 2];
    
    const change = currentYear.minutes - previousYear.minutes;
    const changePercent = previousYear.minutes === 0 
      ? 100 
      : Math.round((change / previousYear.minutes) * 100);
    
    return {
      change,
      changePercent,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  }, [yearlyData]);
  
  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="cosmic-blur p-3 rounded-md border border-cosmic-highlight/20">
          <p className="text-cosmic-white text-sm font-medium">{data.name}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p 
                key={`tooltip-${index}`} 
                className="text-cosmic-white/80 text-sm"
                style={{ color: entry.color }}
              >
                <span className="font-medium">{entry.name}: {entry.value}</span> minutes
              </p>
            ))}
          </div>
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
            <CardTitle className="text-sm text-cosmic-white/70">Years Analyzed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-cosmic-white">{totalYears}</div>
            <div className="text-xs text-cosmic-white/60">
              {totalYears === 0 ? 'No data available' : totalYears === 1 ? 'year of data' : 'years of data'}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm text-cosmic-white/70">Total Focus Time</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-cosmic-white">{totalMinutes} min</div>
            <div className="text-xs text-cosmic-white/60">
              {Math.floor(totalMinutes / 60)} hrs {totalMinutes % 60} min across all years
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm text-cosmic-white/70">Year-over-Year Growth</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {yearOverYearGrowth ? (
              <div className="flex items-center">
                {yearOverYearGrowth.direction === 'up' ? (
                  <>
                    <ArrowUp className="h-6 w-6 mr-2 text-green-400" />
                    <div>
                      <div className="text-xl font-bold text-green-400">+{yearOverYearGrowth.changePercent}%</div>
                      <div className="text-xs text-cosmic-white/60">Increased from previous year</div>
                    </div>
                  </>
                ) : yearOverYearGrowth.direction === 'down' ? (
                  <>
                    <ArrowDown className="h-6 w-6 mr-2 text-red-400" />
                    <div>
                      <div className="text-xl font-bold text-red-400">{yearOverYearGrowth.changePercent}%</div>
                      <div className="text-xs text-cosmic-white/60">Decreased from previous year</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Minus className="h-6 w-6 mr-2 text-cosmic-white/80" />
                    <div>
                      <div className="text-xl font-bold text-cosmic-white/80">No Change</div>
                      <div className="text-xs text-cosmic-white/60">Same as previous year</div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="text-xl font-bold text-cosmic-white/70">Insufficient Data</div>
                <div className="text-xs text-cosmic-white/60">Need at least 2 years of data</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
        <CardHeader className="p-4 pb-2">
          <CardTitle>Yearly Focus Comparison</CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Your focus time aggregated by year
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-[350px] w-full">
            {yearlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={yearlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884d810" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#F8F9FF', opacity: 0.7, fontSize: 12 }}
                    axisLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
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
          <CardTitle>Month-by-Month Yearly Comparison</CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Compare monthly focus patterns across different years
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-[350px] w-full">
            {comparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={comparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884d810" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#F8F9FF', opacity: 0.7, fontSize: 12 }}
                    axisLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
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
                  <Legend />
                  {yearlyData.map((year, index) => (
                    <Line 
                      key={year.year} // Use 'year.year' instead of 'year.name'
                      type="monotone" 
                      dataKey={year.year} // Use 'year.year' instead of 'year.name'
                      stroke={index === 0 ? "#8B5CF6" : index === 1 ? "#EC4899" : index === 2 ? "#10B981" : "#F97316"} 
                      strokeWidth={2}
                      dot={{ fill: index === 0 ? "#8B5CF6" : index === 1 ? "#EC4899" : index === 2 ? "#10B981" : "#F97316", strokeWidth: 2, r: 4 }}
                      activeDot={{ fill: "#D946EF", strokeWidth: 0, r: 6 }}
                      name={year.year} // Use 'year.year' instead of 'year.name'
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-cosmic-white/50">
                No comparison data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
        <CardHeader className="p-4 pb-2">
          <CardTitle>Yearly Focus Insights</CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Analysis of your yearly focus patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Yearly Growth</h4>
              <p className="text-cosmic-white/80 text-sm">
                {yearlyData.length === 0 ? (
                  "No focus sessions recorded in this period."
                ) : yearlyData.length === 1 ? (
                  `You've recorded ${yearlyData[0].minutes} minutes of focus time in ${yearlyData[0].year}. Continue tracking to see year-over-year patterns.`
                ) : yearOverYearGrowth && yearOverYearGrowth.direction === 'up' ? (
                  `Your focus time has increased by ${yearOverYearGrowth.changePercent}% compared to the previous year. This shows excellent progress in your productivity habits.`
                ) : yearOverYearGrowth && yearOverYearGrowth.direction === 'down' ? (
                  `Your focus time has decreased by ${Math.abs(yearOverYearGrowth.changePercent)}% compared to the previous year. Consider what factors may have contributed to this change.`
                ) : (
                  "Your focus time has remained relatively stable year over year. This indicates consistent productivity habits."
                )}
              </p>
            </div>
            
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Seasonal Patterns</h4>
              <p className="text-cosmic-white/80 text-sm">
                {comparisonData.length === 0 ? (
                  "No monthly comparison data available for analysis."
                ) : yearlyData.length === 1 ? (
                  "You only have data for one year. Continue tracking to identify seasonal patterns."
                ) : (
                  "Looking at the monthly distribution across years, you can identify seasonal patterns in your productivity. Pay attention to months where your focus time consistently peaks or dips across multiple years."
                )}
              </p>
            </div>
            
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Long-Term Trend</h4>
              <p className="text-cosmic-white/80 text-sm">
                {yearlyData.length < 3 ? (
                  "You need at least three years of data to establish meaningful long-term trends."
                ) : yearlyData.every((year, i, arr) => i === 0 || year.minutes >= arr[i-1].minutes) ? (
                  "Your focus time shows a consistent upward trend year over year. This indicates excellent progress in building and maintaining productivity habits."
                ) : yearlyData.every((year, i, arr) => i === 0 || year.minutes <= arr[i-1].minutes) ? (
                  "Your focus time shows a consistent downward trend year over year. Consider what factors may be contributing to this decline and how to address them."
                ) : (
                  "Your focus time fluctuates year over year. Look for external factors that might be influencing these changes, such as major life events or changes in work responsibilities."
                )}
              </p>
            </div>
            
            <div className="bg-cosmic-blue/10 p-3 rounded-md border border-cosmic-highlight/10">
              <h4 className="text-cosmic-white font-medium mb-1">Recommendation</h4>
              <p className="text-cosmic-white/80 text-sm">
                {yearlyData.length === 0 ? (
                  "Start tracking your focus sessions to build yearly data for better insights."
                ) : yearlyData.length < 2 ? (
                  "Continue tracking your focus sessions across multiple years to establish meaningful patterns."
                ) : bestYear && bestYear.minutes > 0 ? (
                  `Analyze what made ${bestYear.year} your most productive year (${bestYear.minutes} minutes) and try to replicate those conditions. Set a goal to exceed this benchmark in the current year.`
                ) : yearOverYearGrowth && yearOverYearGrowth.direction === 'down' ? (
                  "Your focus time has decreased compared to the previous year. Set specific goals to reverse this trend, such as scheduling regular focus blocks or implementing a productivity system."
                ) : (
                  "Based on your yearly patterns, consider setting an annual focus time goal and breaking it down into monthly targets. This can help maintain consistency throughout the year."
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YearlyComparisonChart;
