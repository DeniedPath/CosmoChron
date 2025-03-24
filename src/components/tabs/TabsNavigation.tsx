import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Timer, 
  BarChart3, 
  User, 
  Trophy,
  CloudSun,
  Building2,
  Gamepad2,
  MessageSquare
} from 'lucide-react';

const TabsNavigation: React.FC = () => {
  return (
    <TabsList className="grid grid-cols-8 w-full max-w-lg mx-auto mb-8 bg-cosmic-blue/20 border border-cosmic-highlight/20 backdrop-blur-md">
      <TabsTrigger 
        value="timer"
        className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white"
      >
        <Timer className="h-4 w-4 mr-2" />
        Timer
      </TabsTrigger>
      <TabsTrigger 
        value="missions"
        className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white"
      >
        <Trophy className="h-4 w-4 mr-2" />
        Missions
      </TabsTrigger>
      <TabsTrigger 
        value="rank"
        className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white"
      >
        <User className="h-4 w-4 mr-2" />
        Rank
      </TabsTrigger>
      <TabsTrigger 
        value="station"
        className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white"
      >
        <Building2 className="h-4 w-4 mr-2" />
        Station
      </TabsTrigger>
      <TabsTrigger 
        value="stats"
        className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white"
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Stats
      </TabsTrigger>
      <TabsTrigger 
        value="weather"
        className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white"
      >
        <CloudSun className="h-4 w-4 mr-2" />
        Weather
      </TabsTrigger>
      <TabsTrigger 
        value="games"
        className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white"
      >
        <Gamepad2 className="h-4 w-4 mr-2" />
        Games
      </TabsTrigger>
      <TabsTrigger 
        value="chat"
        className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Chat
      </TabsTrigger>
    </TabsList>
  );
};

export default TabsNavigation;
