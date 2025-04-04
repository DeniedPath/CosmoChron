import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { TimerState } from '@/hooks/useTimer';
import { Play, Pause, RotateCcw, SkipForward, Timer } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

interface TimerControlsProps {
  state: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onTimeChange: (minutes: number) => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  state,
  onStart,
  onPause,
  onReset,
  onSkip,
  onTimeChange
}) => {
  const [customMinutes, setCustomMinutes] = useState<number>(25);
  const [isChangingTime, setIsChangingTime] = useState(false);

  const handleSliderChange = (value: number[]) => {
    setCustomMinutes(value[0]);
  };

  const applyCustomTime = () => {
    handleTimeChange(customMinutes);
  };

  // Debounced time change handler to prevent glitching
  const handleTimeChange = useCallback((minutes: number) => {
    if (isChangingTime) return; // Prevent multiple rapid calls
    
    setIsChangingTime(true);
    
    // Always reset the timer first, regardless of state
    onReset();
    
    // Use a timeout to ensure reset completes before setting new time
    setTimeout(() => {
      onTimeChange(minutes);
      setIsChangingTime(false);
    }, 100); // Increased timeout for more reliability
  }, [onReset, onTimeChange, isChangingTime]);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Primary Timer Controls */}
      <div className="flex items-center justify-center space-x-4">
        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-cosmic-gold bg-cosmic-blue/20 hover:bg-cosmic-blue/30 transition-all duration-300"
          disabled={state === 'idle'}
        >
          <RotateCcw className="h-5 w-5 text-cosmic-gold" />
        </Button>

        {/* Start/Pause Button */}
        <Button
          onClick={state === 'running' ? onPause : onStart}
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-cosmic-gold bg-cosmic-purple/50 hover:bg-cosmic-purple/70 transition-all duration-300"
        >
          {state === 'running' ? (
            <Pause className="h-7 w-7 text-cosmic-white" />
          ) : (
            <Play className="h-7 w-7 text-cosmic-white ml-1" />
          )}
        </Button>

        {/* Skip Button */}
        <Button
          onClick={onSkip}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-cosmic-gold bg-cosmic-blue/20 hover:bg-cosmic-blue/30 transition-all duration-300"
          disabled={state === 'idle'}
        >
          <SkipForward className="h-5 w-5 text-cosmic-gold" />
        </Button>
      </div>

      {/* Time Presets */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          onClick={() => handleTimeChange(5)}
          variant="ghost"
          size="sm"
          className="text-cosmic-white/70 hover:text-cosmic-white hover:bg-cosmic-purple/30"
          disabled={isChangingTime}
        >
          5m
        </Button>
        <Button
          onClick={() => handleTimeChange(15)}
          variant="ghost"
          size="sm"
          className="text-cosmic-white/70 hover:text-cosmic-white hover:bg-cosmic-purple/30"
          disabled={isChangingTime}
        >
          15m
        </Button>
        <Button
          onClick={() => handleTimeChange(25)}
          variant="ghost"
          size="sm"
          className="text-cosmic-white/70 hover:text-cosmic-white hover:bg-cosmic-purple/30"
          disabled={isChangingTime}
        >
          25m
        </Button>
        <Button
          onClick={() => handleTimeChange(50)}
          variant="ghost"
          size="sm"
          className="text-cosmic-white/70 hover:text-cosmic-white hover:bg-cosmic-purple/30"
          disabled={isChangingTime}
        >
          50m
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-cosmic-white/70 hover:text-cosmic-white hover:bg-cosmic-purple/30"
              disabled={isChangingTime}
            >
              <Timer className="h-3 w-3 mr-1" />
              Custom
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-cosmic-blue/90 border-cosmic-gold/20 backdrop-blur-lg">
            <div className="space-y-4">
              <h4 className="font-medium text-cosmic-white text-center">Set Custom Time</h4>
              <div className="px-4">
                <Slider
                  defaultValue={[25]}
                  min={1}
                  max={60}
                  step={1}
                  value={[customMinutes]}
                  onValueChange={handleSliderChange}
                  className="mt-2"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-cosmic-white/70">1 min</span>
                  <span className="text-sm text-cosmic-white">{customMinutes} minutes</span>
                  <span className="text-sm text-cosmic-white/70">60 min</span>
                </div>
              </div>
              <Button 
                onClick={applyCustomTime} 
                className="w-full bg-cosmic-accent hover:bg-cosmic-accent/90"
                disabled={isChangingTime}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TimerControls;
