
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getTotalFocusMinutes, getRank, getNextRankProgress } from '@/utils/timerUtils';

const RankSystem = () => {
  const totalFocusMinutes = getTotalFocusMinutes();
  const { title, level } = getRank(totalFocusMinutes);
  const { nextRank, minutesRemaining, progressPercent } = getNextRankProgress(totalFocusMinutes);
  
  return (
    <div className="w-full max-w-md mx-auto animate-scale-up">
      <div className="glass-panel rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-cosmic-white/70">Current Rank</p>
            <h3 className="cosmic-highlight text-xl font-semibold">{title}</h3>
          </div>
          
          <Badge 
            className="bg-cosmic-purple/30 hover:bg-cosmic-purple/40 backdrop-blur-md border border-cosmic-highlight/30 text-cosmic-white px-3 py-1"
          >
            Level {level}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-cosmic-white/70">Total Focus Time</span>
            <span className="text-cosmic-white font-medium">{totalFocusMinutes} minutes</span>
          </div>
          
          <Progress 
            value={progressPercent} 
            className="h-2 bg-cosmic-blue/30"
          />
          
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-cosmic-white/70">Next Rank</span>
            <div className="flex items-center">
              <span className="text-cosmic-white mr-2">{nextRank}</span>
              <span className="text-xs text-cosmic-white/50">
                {minutesRemaining > 0 ? `${minutesRemaining} min remaining` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankSystem;
