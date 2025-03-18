import React, { useMemo } from 'react';
import { getSessions } from '@/utils/timerUtils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  TooltipProps
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, PieChart as PieChartIcon, TrendingUp, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { convertToCSV, convertToJSON, generateAnalyticsSummary, downloadFile } from '@/utils/exportUtils';
import { Session } from '@/types/sessions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';

// Interface for chart data
interface ChartData {
  day: string;
  minutes: number;
}

const customTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="cosmic-blur p-2 rounded-md border border-cosmic-highlight/20">
        <p className="text-cosmic-white text-sm font-medium">{`${payload[0].value} minutes`}</p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const sessions: Session[] = getSessions();
  
  // Handle exporting data in different formats
  const handleExport = (format: 'csv' | 'json' | 'summary') => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (format) {
      case 'csv':
        const csvData = convertToCSV(sessions);
        downloadFile(csvData, `cosmic-focus-sessions-${timestamp}.csv`, 'text/csv');
        toast({
          title: "Export Successful",
          description: "Your sessions data has been exported as CSV",
          duration: 3000,
        });
        break;
      case 'json':
        const jsonData = convertToJSON(sessions);
        downloadFile(jsonData, `cosmic-focus-sessions-${timestamp}.json`, 'application/json');
        toast({
          title: "Export Successful",
          description: "Your sessions data has been exported as JSON",
          duration: 3000,
        });
        break;
      case 'summary':
        const summaryData = generateAnalyticsSummary(sessions);
        downloadFile(summaryData, `cosmic-focus-summary-${timestamp}.json`, 'application/json');
        toast({
          title: "Export Successful",
          description: "Your analytics summary has been exported",
          duration: 3000,
        });
        break;
    }
  };
  
  // Prepare data for the weekly chart
  const weeklyChartData = useMemo(() => {
    if (!sessions.length) return [];
    
    // Get last 7 days
    const last7Days: { [key: string]: ChartData } = {};
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      last7Days[dayStr] = { day: dayStr, minutes: 0 };
    }
    
    // Sum up focus minutes by day
    sessions.forEach(session => {
      if (!session.completed) return;
      
      const sessionDate = new Date(session.timestamp);
      const dayStr = sessionDate.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Only include sessions from the last 7 days
      const dayDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff < 7 && last7Days[dayStr]) {
        last7Days[dayStr].minutes += session.durationMinutes;
      }
    });
    
    return Object.values(last7Days);
  }, [sessions]);

  // Prepare data for the monthly trend
  const monthlyChartData = useMemo(() => {
    if (!sessions.length) return [];
    
    // Get last 30 days grouped by week
    const last4Weeks: { [key: string]: number } = {};
    const today = new Date();
    
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - 6);
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - (i * 7));
      
      const weekLabel = `Week ${4-i}`;
      last4Weeks[weekLabel] = 0;
      
      // Sum up focus minutes for this week
      sessions.forEach(session => {
        if (!session.completed) return;
        
        const sessionDate = new Date(session.timestamp);
        if (sessionDate >= weekStart && sessionDate <= weekEnd) {
          last4Weeks[weekLabel] += session.durationMinutes;
        }
      });
    }
    
    return Object.entries(last4Weeks).map(([name, minutes]) => ({ name, minutes })).reverse();
  }, [sessions]);

  // Prepare data for the session duration distribution
  const durationDistribution = useMemo(() => {
    if (!sessions.length) return [];
    
    const completedSessions = sessions.filter(s => s.completed);
    const durations: { [key: string]: number } = {
      "< 15 min": 0,
      "15-30 min": 0,
      "30-45 min": 0,
      "45-60 min": 0,
      "> 60 min": 0
    };
    
    completedSessions.forEach(session => {
      const duration = session.durationMinutes;
      
      if (duration < 15) durations["< 15 min"]++;
      else if (duration < 30) durations["15-30 min"]++;
      else if (duration < 45) durations["30-45 min"]++;
      else if (duration < 60) durations["45-60 min"]++;
      else durations["> 60 min"]++;
    });
    
    const COLORS = ['#6E56CF', '#8672D8', '#9F8EE1', '#B7AAEB', '#D0C6F4'];
    
    return Object.entries(durations).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index]
    }));
  }, [sessions]);

  // Prepare data for time of day distribution
  const timeOfDayData = useMemo(() => {
    if (!sessions.length) return [];
    
    const timeDistribution: { [key: string]: number } = {
      "Morning (5-12)": 0,
      "Afternoon (12-17)": 0,
      "Evening (17-22)": 0,
      "Night (22-5)": 0
    };
    
    sessions.forEach(session => {
      if (!session.completed) return;
      
      const sessionDate = new Date(session.timestamp);
      const hour = sessionDate.getHours();
      
      if (hour >= 5 && hour < 12) timeDistribution["Morning (5-12)"] += session.durationMinutes;
      else if (hour >= 12 && hour < 17) timeDistribution["Afternoon (12-17)"] += session.durationMinutes;
      else if (hour >= 17 && hour < 22) timeDistribution["Evening (17-22)"] += session.durationMinutes;
      else timeDistribution["Night (22-5)"] += session.durationMinutes;
    });
    
    return Object.entries(timeDistribution).map(([name, minutes]) => ({ name, minutes }));
  }, [sessions]);
  
  // Calculate some stats
  const totalSessions = sessions.filter(s => s.completed).length;
  const totalMinutes = sessions.reduce((sum, session) => session.completed ? sum + session.durationMinutes : sum, 0);
  const averageMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
  const longestSession = sessions.reduce((max, session) => 
    session.completed && session.durationMinutes > max ? session.durationMinutes : max, 0);
  
  // Current streak calculation
  const currentStreak = useMemo(() => {
    if (!sessions.length) return 0;
    
    // Sort sessions by date
    const sortedSessions = [...sessions]
      .filter(s => s.completed)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (sortedSessions.length === 0) return 0;
    
    // Check if there's a session today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const latestSessionDate = new Date(sortedSessions[0].timestamp);
    latestSessionDate.setHours(0, 0, 0, 0);
    
    // If the latest session is not from today or yesterday, streak is broken
    const dayDiff = Math.floor((today.getTime() - latestSessionDate.getTime()) / (86400000));
    if (dayDiff > 1) return 0;
    
    // Count the streak
    let streak = 1;
    let currentDate = latestSessionDate;
    
    for (let i = 1; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].timestamp);
      sessionDate.setHours(0, 0, 0, 0);
      
      // Check if this session was the day before the current date
      const expectedPrevDate = new Date(currentDate);
      expectedPrevDate.setDate(currentDate.getDate() - 1);
      
      if (sessionDate.getTime() === expectedPrevDate.getTime()) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }
    
    return streak;
  }, [sessions]);
  
  return (
    <div className="space-y-6 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-cosmic-white">Analytics</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-cosmic-blue/20 border border-cosmic-highlight/20 backdrop-blur-lg hover:bg-cosmic-purple/30">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-cosmic-blue/90 backdrop-blur-lg border-cosmic-highlight/20">
            <DropdownMenuItem 
              className="text-cosmic-white hover:bg-cosmic-purple/30 cursor-pointer"
              onClick={() => handleExport('csv')}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-cosmic-white hover:bg-cosmic-purple/30 cursor-pointer"
              onClick={() => handleExport('json')}
            >
              <FileJson className="w-4 h-4 mr-2" />
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-cosmic-white hover:bg-cosmic-purple/30 cursor-pointer"
              onClick={() => handleExport('summary')}
            >
              <PieChartIcon className="w-4 h-4 mr-2" />
              Export Analytics Summary
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 bg-cosmic-blue/30 backdrop-blur-md border border-cosmic-highlight/20 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white">
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white">
            <PieChartIcon className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm text-cosmic-white/70">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold cosmic-highlight">{totalSessions}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm text-cosmic-white/70">Avg. Time</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold cosmic-highlight">{averageMinutes} min</p>
              </CardContent>
            </Card>
            
            <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm text-cosmic-white/70">Total Time</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold cosmic-highlight">{totalMinutes} min</p>
              </CardContent>
            </Card>
            
            <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm text-cosmic-white/70">Current Streak</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-2xl font-bold cosmic-highlight">{currentStreak} days</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg mb-6">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm text-cosmic-white/70">Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-[200px] w-full">
                {weeklyChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <XAxis 
                        dataKey="day" 
                        tick={{ fill: '#F8F9FF', opacity: 0.7, fontSize: 12 }}
                        axisLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
                      />
                      <YAxis 
                        tick={{ fill: '#F8F9FF', opacity: 0.7, fontSize: 12 }}
                        axisLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
                        tickLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
                      />
                      <Tooltip content={customTooltip} />
                      <Bar 
                        dataKey="minutes" 
                        fill="#6E56CF" 
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-cosmic-white/50">
                    Complete focus sessions to see your stats
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm text-cosmic-white/70">Monthly Trend</CardTitle>
                <CardDescription className="text-cosmic-white/50 text-xs">
                  Your focus time over the last 4 weeks
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-[250px] w-full">
                  {monthlyChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#F8F9FF', opacity: 0.7, fontSize: 12 }}
                          axisLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
                        />
                        <YAxis 
                          tick={{ fill: '#F8F9FF', opacity: 0.7, fontSize: 12 }}
                          axisLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
                          tickLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
                        />
                        <Tooltip content={customTooltip} />
                        <Line 
                          type="monotone" 
                          dataKey="minutes" 
                          stroke="#8B5CF6" 
                          strokeWidth={3}
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          activeDot={{ fill: '#D946EF', strokeWidth: 0, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-cosmic-white/50">
                      Complete focus sessions to see trends
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm text-cosmic-white/70">Focus Time by Hour of Day</CardTitle>
                <CardDescription className="text-cosmic-white/50 text-xs">
                  When you focus the most
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-[250px] w-full">
                  {timeOfDayData.length > 0 && timeOfDayData.some(d => d.minutes > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={timeOfDayData} layout="vertical" margin={{ top: 5, right: 30, left: 90, bottom: 5 }}>
                        <XAxis 
                          type="number"
                          tick={{ fill: '#F8F9FF', opacity: 0.7, fontSize: 12 }}
                          axisLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
                        />
                        <YAxis 
                          dataKey="name" 
                          type="category"
                          tick={{ fill: '#F8F9FF', opacity: 0.7, fontSize: 12 }}
                          axisLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
                          tickLine={{ stroke: '#F8F9FF', opacity: 0.2 }}
                        />
                        <Tooltip content={customTooltip} />
                        <Bar 
                          dataKey="minutes" 
                          fill="#6E56CF" 
                          radius={[0, 4, 4, 0]}
                        >
                          {timeOfDayData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`rgba(110, 86, 207, ${0.5 + (index * 0.1)})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-cosmic-white/50">
                      Complete focus sessions to see time of day patterns
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm text-cosmic-white/70">Session Duration Distribution</CardTitle>
                <CardDescription className="text-cosmic-white/50 text-xs">
                  How long your focus sessions typically last
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-[240px] w-full">
                  {durationDistribution.length > 0 && durationDistribution.some(d => d.value > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={durationDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => percent > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''}
                        >
                          {durationDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} sessions`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-cosmic-white/50">
                      Complete focus sessions to see duration insights
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm text-cosmic-white/70">Focus Stats</CardTitle>
                <CardDescription className="text-cosmic-white/50 text-xs">
                  Your personal bests and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-cosmic-white/10 pb-2">
                    <span className="text-cosmic-white/70">Longest session</span>
                    <span className="text-cosmic-white font-medium">{longestSession} minutes</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-cosmic-white/10 pb-2">
                    <span className="text-cosmic-white/70">Best streak</span>
                    <span className="text-cosmic-white font-medium">{currentStreak} days</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-cosmic-white/10 pb-2">
                    <span className="text-cosmic-white/70">Total focus time</span>
                    <span className="text-cosmic-white font-medium">{Math.floor(totalMinutes / 60)} hrs {totalMinutes % 60} min</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-cosmic-white/10 pb-2">
                    <span className="text-cosmic-white/70">Average per day</span>
                    <span className="text-cosmic-white font-medium">
                      {weeklyChartData.length > 0 
                        ? Math.round(weeklyChartData.reduce((sum, day) => sum + day.minutes, 0) / 7)
                        : 0} min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cosmic-white/70">Completion rate</span>
                    <span className="text-cosmic-white font-medium">
                      {sessions.length > 0 
                        ? Math.round((sessions.filter(s => s.completed).length / sessions.length) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
