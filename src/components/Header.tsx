
import React from 'react';
import { Trophy, HelpCircle, Settings, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WeatherDisplay from '@/components/weather/WeatherDisplay';

interface HeaderProps {
  cosmicPoints: number;
}

const Header: React.FC<HeaderProps> = ({ cosmicPoints }) => {
  return (
    <header className="flex items-center justify-between mb-12">
      <div className="flex items-center space-x-3">
        <Rocket className="w-7 h-7 text-cosmic-highlight" />
        <h1 className="text-2xl font-bold cosmic-highlight">Space Timer</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex">
          <WeatherDisplay compact />
        </div>
        
        <div className="bg-cosmic-blue/20 border border-cosmic-highlight/20 rounded-full py-1 px-3 flex items-center">
          <Trophy className="h-4 w-4 text-cosmic-highlight mr-1.5" />
          <span className="text-sm text-cosmic-white">{cosmicPoints} points</span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full h-9 w-9 bg-cosmic-blue/20 hover:bg-cosmic-blue/30 text-cosmic-white/70"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full h-9 w-9 bg-cosmic-blue/20 hover:bg-cosmic-blue/30 text-cosmic-white/70"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
