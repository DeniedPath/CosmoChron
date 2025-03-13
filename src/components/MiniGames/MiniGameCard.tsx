
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Timer } from 'lucide-react';

interface MiniGameCardProps {
  title: string;
  description: string;
  onPlay: () => void;
  duration: number;
}

const MiniGameCard: React.FC<MiniGameCardProps> = ({
  title,
  description,
  onPlay,
  duration,
}) => {
  return (
    <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-md hover:bg-cosmic-blue/30 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cosmic-white">
          <Gamepad2 className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-cosmic-white/70">
          <div className="flex items-center gap-1">
            <Timer className="h-4 w-4" />
            {duration} min
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-cosmic-white/80 mb-4">{description}</p>
        <Button 
          onClick={onPlay}
          className="w-full bg-cosmic-purple/60 hover:bg-cosmic-purple/80"
        >
          Play Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default MiniGameCard;
