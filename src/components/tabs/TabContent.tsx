"use client";

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import Timer from '@/components/timer/Timer';
import RankSystem from '@/components/features/RankSystem';
import Analytics from '@/components/analytics/Analytics';
import MissionSystem from '@/components/features/MissionSystem';
import WeatherDisplay from '@/components/weather/WeatherDisplay';
import SpaceStation from '@/components/features/SpaceStation';
import MiniGames from '@/components/MiniGames/MiniGames';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, CloudLightning, CloudRain, CloudSnow, CloudSun, MessageSquare, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TabContentProps {
  totalFocusMinutes: number;
  level: number;
  progressPercent: number;
}

const TabContent: React.FC<TabContentProps> = ({ 
  totalFocusMinutes, 
  level, 
  progressPercent 
}) => {
  const router = useRouter();
  
  const handleChatClick = () => {
    router.push('/chat');
  };
  
  return (
    <>
      <TabsContent value="timer" className="animate-fade-in mt-0">
        <Timer />
      </TabsContent>
      
      <TabsContent value="missions" className="animate-fade-in mt-0">
        <MissionSystem />
      </TabsContent>
      
      <TabsContent value="rank" className="animate-fade-in mt-0">
        <RankSystem />
      </TabsContent>
      
      <TabsContent value="station" className="animate-fade-in mt-0">
        <div className="space-y-4">
          <SpaceStation 
            totalMinutes={totalFocusMinutes}
            currentLevel={level}
            progressPercent={progressPercent}
          />
          
          <div className="text-center mt-6">
            <Button className="bg-cosmic-purple/60 hover:bg-cosmic-purple/80" asChild>
              <Link href="/station">
                <Building2 className="mr-2 h-4 w-4" />
                View Full Space Station
              </Link>
            </Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="stats" className="animate-fade-in mt-0">
        <Analytics />
      </TabsContent>
      
      <TabsContent value="weather" className="animate-fade-in mt-0">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <div className="cosmic-blur p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-cosmic-white mb-4">Current Weather</h2>
              <WeatherDisplay />
              <p className="mt-4 text-cosmic-white/80 text-sm">
                Your focus environment adapts to the local weather conditions, 
                creating a unique and immersive experience for each session.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="cosmic-blur p-6 rounded-xl h-full">
              <h2 className="text-xl font-semibold text-cosmic-white mb-4">Weather Effects</h2>
              <p className="text-cosmic-white/80 mb-3">
                Different weather conditions influence your cosmic environment:
              </p>
              <ul className="space-y-2 text-cosmic-white/70">
                <li className="flex items-center">
                  <Sun className="h-5 w-5 mr-2 text-yellow-400" />
                  <span>Clear skies bring bright stars and cosmic clarity</span>
                </li>
                <li className="flex items-center">
                  <CloudSun className="h-5 w-5 mr-2 text-blue-300" />
                  <span>Cloudy weather adds dreamy nebula effects</span>
                </li>
                <li className="flex items-center">
                  <CloudRain className="h-5 w-5 mr-2 text-blue-400" />
                  <span>Rain transforms into beautiful meteor showers</span>
                </li>
                <li className="flex items-center">
                  <CloudLightning className="h-5 w-5 mr-2 text-purple-400" />
                  <span>Thunderstorms create dramatic cosmic energy bursts</span>
                </li>
                <li className="flex items-center">
                  <CloudSnow className="h-5 w-5 mr-2 text-cyan-200" />
                  <span>Snow becomes gentle floating stardust</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="games" className="animate-fade-in mt-0">
        <MiniGames />
      </TabsContent>
      
      <TabsContent value="chat" className="animate-fade-in mt-0">
        <div className="text-center py-8">
          <div className="mb-6">
            <MessageSquare className="h-16 w-16 mx-auto text-cosmic-purple" />
            <h2 className="text-2xl font-bold mt-4 text-cosmic-white">CosmoChat</h2>
            <p className="text-cosmic-white/70 mt-2">
              Chat with your AI companion in a cosmic-themed environment
            </p>
          </div>
          <Button 
            onClick={handleChatClick}
            className="bg-cosmic-purple/60 hover:bg-cosmic-purple/80"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Open Chat Interface
          </Button>
        </div>
      </TabsContent>
    </>
  );
};

export default TabContent;
