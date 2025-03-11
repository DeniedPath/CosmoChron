import React, { useState, useEffect } from 'react';
import { useTimer } from '@/context/TimerContext';
import { formatTime, calculateProgress } from '@/utils/timerUtils';
import { Progress } from '@/components/ui/progress';

interface TimerProps {
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ className = '' }) => {
  const { seconds, totalSeconds, isRunning, isComplete, timerMode } = useTimer();
  const [progress, setProgress] = useState(0);
  const [messageVisible, setMessageVisible] = useState(false);
  
  // Calculate progress percentage
  useEffect(() => {
    if (timerMode === 'stopwatch') {
      // For stopwatch, progress increases as time goes up
      setProgress(Math.min((seconds / (60 * 60)) * 100, 100)); // Max at 1 hour
    } else {
      // For timer modes, progress increases as time goes down
      setProgress(calculateProgress(seconds, totalSeconds));
    }
  }, [seconds, totalSeconds, timerMode]);
  
  // Show completion message
  useEffect(() => {
    if (isComplete) {
      setMessageVisible(true);
      const timer = setTimeout(() => {
        setMessageVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  // Get color based on progress
  const getProgressColor = () => {
    if (timerMode === 'stopwatch') return 'bg-space-cosmic-purple';
    
    if (progress < 33) return 'bg-green-500';
    if (progress < 66) return 'bg-blue-500';
    return 'bg-space-cosmic-purple';
  };

  return (
    <div 
      className={`relative flex flex-col items-center justify-center ${className}`}
    >
      {/* Main Timer Display */}
      <div className="relative mb-6 animate-fade-in">
        <h1 className="text-8xl font-extralight tracking-tighter text-gradient">
          {formatTime(seconds)}
        </h1>
        
        {/* Completion Message */}
        {messageVisible && (
          <div className="absolute inset-0 flex items-center justify-center animate-scale-up">
            <div className="glass-morphism rounded-xl py-3 px-6 text-2xl font-light">
              Time's up! 🎉
            </div>
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      <Progress 
        value={progress} 
        className={`w-full h-2 rounded-full ${
          isRunning ? 'transition-all duration-1000' : ''
        } ${getProgressColor()}`}
      />
      
      {/* Session Type */}
      <div className="mt-3 text-muted-foreground text-sm animate-fade-in">
        {timerMode === 'focus' && 'Focus Session'}
        {timerMode === 'pomodoro' && 'Pomodoro Session'}
        {timerMode === 'stopwatch' && 'Stopwatch'}
      </div>
    </div>
  );
};

export default Timer;