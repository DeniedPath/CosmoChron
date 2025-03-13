
import React from 'react';
import MiniGameCard from './MiniGameCard';
import { toast } from '@/components/ui/use-toast';

const MiniGames = () => {
  const handlePlay = (game: string) => {
    toast({
      title: "Coming Soon!",
      description: `${game} will be available in the next update.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-cosmic-white">Break Time Mini-games</h2>
        <p className="text-cosmic-white/70">
          Take a fun break between focus sessions with these space-themed mini-games
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MiniGameCard
          title="Asteroid Dodge"
          description="Navigate through an asteroid field in this classic arcade-style game."
          duration={5}
          onPlay={() => handlePlay("Asteroid Dodge")}
        />
        
        <MiniGameCard
          title="Space Memory"
          description="Match pairs of cosmic objects in this memory challenge."
          duration={3}
          onPlay={() => handlePlay("Space Memory")}
        />
        
        <MiniGameCard
          title="Constellation Connect"
          description="Connect stars to recreate famous constellations against time."
          duration={4}
          onPlay={() => handlePlay("Constellation Connect")}
        />
      </div>
    </div>
  );
};

export default MiniGames;
