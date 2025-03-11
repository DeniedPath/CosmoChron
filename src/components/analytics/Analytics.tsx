import React, { useState } from 'react';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserStats } from '@/utils/achievementUtils';
import { Calendar, Clock, Zap, TrendingUp } from 'lucide-react';

interface AnalyticsProps {
  stats: UserStats;
  isVisible: boolean;
}

const Analytics: React.FC<AnalyticsProps> = ({ stats, isVisible }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  
  // Generate mock data for the chart
  const generateChartData = () => {
    if (activeTab === 'daily') {
      // Generate last 7 days of data
      const data = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Create random focus time around the average session time
        const avgSessionTime = stats.totalSessions > 0 
          ? stats.totalFocusTime / stats.totalSessions 
          : 1500; // Default to 25min
        
        // More focus time for recent days if we have a streak
        const focusTime = i < stats.currentStreak
          ? Math.max(30, Math.floor(avgSessionTime / 60) + Math.floor(Math.random() * 30))
          : Math.floor(Math.random() * 20);
        
        data.push({
          day: date.toLocaleDateString(undefined, { weekday: 'short' }),
          focusTime: focusTime
        });
      }
      
      return data;
    } else {
      // Generate weekly data
      return [
        { week: 'Week 1', focusTime: Math.floor(Math.random() * 200 + 100) },
        { week: 'Week 2', focusTime: Math.floor(Math.random() * 200 + 100) },
        { week: 'Week 3', focusTime: Math.floor(Math.random() * 200 + 100) },
        { week: 'Week 4', focusTime: Math.floor(Math.random() * 200 + 100) },
      ];
    }
  };
  
  const data = generateChartData();
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cosmic-dark/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-auto cosmic-card">
        <div className="p-6">
          <h2 className="text-2xl font-medium mb-6">Focus Analytics</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-cosmic-deep p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-nebula-blue/20 text-nebula-blue">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-xs text-white/70">Total Focus</div>
              </div>
              <div className="text-2xl font-light">
                {Math.floor(stats.totalFocusTime / 60)} min
              </div>
            </div>
            
            <div className="bg-cosmic-deep p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-nebula-purple/20 text-nebula-purple">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-xs text-white/70">Total Days</div>
              </div>
              <div className="text-2xl font-light">
                {stats.totalDays}
              </div>
            </div>
            
            <div className="bg-cosmic-deep p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-nebula-pink/20 text-nebula-pink">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-xs text-white/70">Current Streak</div>
              </div>
              <div className="text-2xl font-light">
                {stats.currentStreak} days
              </div>
            </div>
            
            <div className="bg-cosmic-deep p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-green-500/20 text-green-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-xs text-white/70">Sessions</div>
              </div>
              <div className="text-2xl font-light">
                {stats.totalSessions}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex bg-cosmic-deep rounded-lg p-1 mb-4">
              <button
                className={`flex-1 py-2 rounded-md transition-colors ${activeTab === 'daily'
                  ? 'bg-cosmic-mid text-white'
                  : 'text-white/60 hover:text-white'
                }`}
                onClick={() => setActiveTab('daily')}
              >
                Daily
              </button>
              <button
                className={`flex-1 py-2 rounded-md transition-colors ${activeTab === 'weekly'
                  ? 'bg-cosmic-mid text-white'
                  : 'text-white/60 hover:text-white'
                }`}
                onClick={() => setActiveTab('weekly')}
              >
                Weekly
              </button>
            </div>
            
            <div className="h-72 bg-cosmic-deep p-4 rounded-xl border border-white/10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey={activeTab === 'daily' ? 'day' : 'week'} 
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }} 
                  />
                  <YAxis 
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }} 
                    label={{ 
                      value: 'Minutes', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }
                    }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 42, 94, 0.9)', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="focusTime"
                    stroke="#6C63FF"
                    fillOpacity={1}
                    fill="url(#focusGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-white/70 mb-4">
              Keep focusing to see your analytics grow over time
            </p>
            <button 
              className="cosmic-button"
              onClick={() => window.location.reload()}
            >
              Back to Timer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;