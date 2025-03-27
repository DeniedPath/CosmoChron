"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Star, Trophy, Rocket, Clock, Zap } from 'lucide-react';
import { getTotalFocusMinutes, getRank, getNextRankProgress } from '@/utils/timerUtils';
import { getCosmicPoints } from '@/utils/missionUtils';

const SpaceStationContent: React.FC = () => {
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [level, setLevel] = useState(1);
  const [rank, setRank] = useState('Cosmic Cadet');
  const [progressPercent, setProgressPercent] = useState(0);
  const [cosmicPoints, setCosmicPoints] = useState(0);
  const [achievements, setAchievements] = useState<{id: string, title: string, description: string, completed: boolean, date?: string}[]>([]);
  const [stats, setStats] = useState({
    sessionsCompleted: 0,
    longestStreak: 0,
    currentStreak: 0,
    averageSessionLength: 0
  });
  
  useEffect(() => {
    // Load user data
    try {
      const minutes = getTotalFocusMinutes();
      setTotalFocusMinutes(minutes);
      
      const rankInfo = getRank(minutes);
      setLevel(rankInfo.level);
      setRank(rankInfo.title);
      
      const progressInfo = getNextRankProgress(minutes);
      setProgressPercent(progressInfo.progressPercent);
      
      setCosmicPoints(getCosmicPoints());
      
      // Load achievements from localStorage
      const savedAchievements = localStorage.getItem('achievements');
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      } else {
        // Default achievements if none exist
        const defaultAchievements = [
          {
            id: 'first-session',
            title: 'First Launch',
            description: 'Complete your first focus session',
            completed: minutes > 0,
            date: minutes > 0 ? new Date().toISOString() : undefined
          },
          {
            id: 'hour-focus',
            title: 'Focused Explorer',
            description: 'Accumulate 60 minutes of focus time',
            completed: minutes >= 60,
            date: minutes >= 60 ? new Date().toISOString() : undefined
          },
          {
            id: 'daily-streak',
            title: 'Cosmic Consistency',
            description: 'Complete at least one focus session for 3 days in a row',
            completed: false
          },
          {
            id: 'rank-up',
            title: 'Rising Star',
            description: 'Reach rank 2',
            completed: level >= 2,
            date: level >= 2 ? new Date().toISOString() : undefined
          },
          {
            id: 'chat-first',
            title: 'AI Companion',
            description: 'Have your first conversation with the AI assistant',
            completed: false
          }
        ];
        setAchievements(defaultAchievements);
        localStorage.setItem('achievements', JSON.stringify(defaultAchievements));
      }
      
      // Load stats from localStorage
      const savedStats = localStorage.getItem('focusStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      } else {
        // Generate default stats based on total focus minutes
        const sessionsEstimate = Math.max(1, Math.floor(minutes / 25));
        const defaultStats = {
          sessionsCompleted: sessionsEstimate,
          longestStreak: Math.min(7, Math.floor(sessionsEstimate / 3)),
          currentStreak: Math.min(3, sessionsEstimate),
          averageSessionLength: minutes > 0 ? Math.round(minutes / sessionsEstimate) : 25
        };
        setStats(defaultStats);
        localStorage.setItem('focusStats', JSON.stringify(defaultStats));
      }
    } catch (e) {
      console.error("Error loading space station data:", e);
    }
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-cosmic-white flex items-center gap-2">
          <Building2 className="h-7 w-7" />
          Space Station
        </h1>
        <Badge variant="outline" className="px-3 py-1 bg-cosmic-blue/20 text-cosmic-white border-cosmic-highlight/30">
          Level {level} • {rank}
        </Badge>
      </div>
      
      <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-cosmic-white">Cosmic Progress</CardTitle>
          <CardDescription className="text-cosmic-white/70">
            Your journey through the cosmos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-cosmic-white/70">
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-cosmic-white/70">{progressPercent}% to next rank</span>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-cosmic-white">{cosmicPoints} Cosmic Points</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cosmic-blue/10 rounded-lg p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-cosmic-white/70" />
              <div className="text-2xl font-bold text-cosmic-white">{totalFocusMinutes}</div>
              <div className="text-sm text-cosmic-white/70">Total Focus Minutes</div>
            </div>
            <div className="bg-cosmic-blue/10 rounded-lg p-4 text-center">
              <Zap className="h-6 w-6 mx-auto mb-2 text-cosmic-white/70" />
              <div className="text-2xl font-bold text-cosmic-white">{stats.sessionsCompleted}</div>
              <div className="text-sm text-cosmic-white/70">Sessions Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements">
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id}
                className={`bg-cosmic-blue/10 border-cosmic-highlight/20 ${achievement.completed ? 'border-l-4 border-l-green-500' : 'opacity-70'}`}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-3 rounded-full ${achievement.completed ? 'bg-green-500/20' : 'bg-cosmic-blue/20'}`}>
                    <Trophy className={`h-6 w-6 ${achievement.completed ? 'text-green-500' : 'text-cosmic-white/50'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-cosmic-white">{achievement.title}</h3>
                    <p className="text-sm text-cosmic-white/70">{achievement.description}</p>
                    {achievement.completed && achievement.date && (
                      <p className="text-xs text-cosmic-white/50 mt-1">
                        Completed on {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {achievement.completed ? (
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Completed</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-cosmic-blue/10 text-cosmic-white/50 border-cosmic-white/20">In Progress</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-cosmic-white">Focus Statistics</CardTitle>
              <CardDescription className="text-cosmic-white/70">
                Your productivity metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-cosmic-blue/10 rounded-lg p-4">
                  <div className="text-sm text-cosmic-white/70 mb-1">Total Focus Time</div>
                  <div className="text-2xl font-bold text-cosmic-white">{totalFocusMinutes} minutes</div>
                  <div className="text-xs text-cosmic-white/50 mt-1">
                    {Math.floor(totalFocusMinutes / 60)} hours {totalFocusMinutes % 60} minutes
                  </div>
                </div>
                <div className="bg-cosmic-blue/10 rounded-lg p-4">
                  <div className="text-sm text-cosmic-white/70 mb-1">Sessions Completed</div>
                  <div className="text-2xl font-bold text-cosmic-white">{stats.sessionsCompleted}</div>
                  <div className="text-xs text-cosmic-white/50 mt-1">
                    Avg. {stats.averageSessionLength} min per session
                  </div>
                </div>
                <div className="bg-cosmic-blue/10 rounded-lg p-4">
                  <div className="text-sm text-cosmic-white/70 mb-1">Current Streak</div>
                  <div className="text-2xl font-bold text-cosmic-white">{stats.currentStreak} days</div>
                  <div className="text-xs text-cosmic-white/50 mt-1">
                    Keep it going!
                  </div>
                </div>
                <div className="bg-cosmic-blue/10 rounded-lg p-4">
                  <div className="text-sm text-cosmic-white/70 mb-1">Longest Streak</div>
                  <div className="text-2xl font-bold text-cosmic-white">{stats.longestStreak} days</div>
                  <div className="text-xs text-cosmic-white/50 mt-1">
                    {stats.currentStreak >= stats.longestStreak ? "You're at your best!" : "Can you beat it?"}
                  </div>
                </div>
              </div>
              
              <div className="bg-cosmic-blue/10 rounded-lg p-4">
                <h3 className="text-cosmic-white font-medium mb-2">Focus Distribution</h3>
                <div className="h-20 flex items-end gap-1">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const height = Math.floor(Math.random() * 70) + 30;
                    return (
                      <div 
                        key={i}
                        className="bg-cosmic-purple/60 rounded-t-sm flex-1"
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-cosmic-white/50">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-cosmic-blue/10 text-cosmic-white border-cosmic-highlight/30">
                Download Stats
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpaceStationContent;
