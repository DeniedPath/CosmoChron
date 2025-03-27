import React from 'react';
import Link from 'next/link';
import { Trophy, HelpCircle, Settings, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WeatherDisplay from '@/components/weather/WeatherDisplay';

interface HeaderProps {
  cosmicPoints: number;
}

const Header: React.FC<HeaderProps> = ({ cosmicPoints }) => {
  return (
    <header className="flex items-center justify-between mb-12 p-4 border border-cosmic-gold rounded-lg shadow-md">
      <div className="flex items-center space-x-3 border-r border-cosmic-gold pr-4">
        <Rocket className="w-7 h-7 text-cosmic-gold" />
        <h1 className="text-2xl font-bold text-cosmic-gold">CosmoChron</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex border border-cosmic-gold rounded-lg p-2">
          <WeatherDisplay compact />
        </div>
        
        <div className="bg-cosmic-blue/40 border border-cosmic-gold rounded-full py-1 px-3 flex items-center">
          <Trophy className="h-4 w-4 text-cosmic-gold mr-1.5" />
          <span className="text-sm font-medium text-cosmic-white">{cosmicPoints} points</span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full h-9 w-9 bg-cosmic-blue/40 hover:bg-cosmic-blue/60 text-cosmic-white border border-cosmic-gold"
            asChild
          >
            <Link href="/help">
              <HelpCircle className="h-5 w-5 text-cosmic-gold" />
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full h-9 w-9 bg-cosmic-blue/40 hover:bg-cosmic-blue/60 text-cosmic-white border border-cosmic-gold"
            asChild
          >
            <Link href="/settings">
              <Settings className="h-5 w-5 text-cosmic-gold" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;