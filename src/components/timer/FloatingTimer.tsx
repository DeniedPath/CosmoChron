"use client";

import React, { useState, useEffect } from 'react';
import { useGlobalTimer } from '@/contexts/TimerContext';
import { Button } from '@/components/ui/button';
import { 
  Play, Pause, RotateCcw, SkipForward, 
  Minimize2, X, Clock 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingTimer: React.FC = () => {
  const { 
    formattedTime, 
    state, 
    progress,
    isTimerVisible,
    actions: { start, pause, reset, skip, toggleTimerVisibility }
  } = useGlobalTimer();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // If timer is not visible or we're on server-side, don't render anything
  if (!isTimerVisible || !isClient) return null;

  // Size calculations for timer display
  const circumference = 2 * Math.PI * 40; // 40 is the radius for the floating timer
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const toggleMinimize = () => {
    setIsMinimized(prev => !prev);
  };

  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 z-50 bg-cosmic-blue/90 backdrop-blur-md rounded-2xl shadow-lg transition-all duration-300 border border-cosmic-highlight/30",
        isMinimized ? "w-14 h-14" : "w-64 p-4"
      )}
      style={{ 
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: isMinimized ? 'auto' : 'calc(100vh - 32px)',
        overflow: 'hidden'
      }}
    >
      {isMinimized ? (
        <button 
          onClick={toggleMinimize}
          className="w-full h-full flex items-center justify-center text-cosmic-white"
          aria-label="Expand timer"
        >
          <div className="relative flex items-center justify-center">
            <Clock className="h-6 w-6" />
            {state === 'running' && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-cosmic-highlight rounded-full animate-pulse" />
            )}
          </div>
        </button>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-cosmic-white">Space Timer</h3>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-cosmic-white/70 hover:text-cosmic-white hover:bg-cosmic-blue/50"
                onClick={toggleMinimize}
                aria-label="Minimize timer"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-cosmic-white/70 hover:text-cosmic-white hover:bg-cosmic-blue/50"
                onClick={toggleTimerVisibility}
                aria-label="Close timer"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-3">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="5"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(138, 180, 248, 0.8)"
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-cosmic-white">{formattedTime}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-cosmic-blue/30 hover:bg-cosmic-blue/50 text-cosmic-white"
              onClick={reset}
              disabled={state === 'idle'}
              aria-label="Reset timer"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-cosmic-purple/50 hover:bg-cosmic-purple/70 text-cosmic-white"
              onClick={state === 'running' ? pause : start}
              aria-label={state === 'running' ? "Pause timer" : "Start timer"}
            >
              {state === 'running' ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-cosmic-blue/30 hover:bg-cosmic-blue/50 text-cosmic-white"
              onClick={skip}
              aria-label="Skip timer"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingTimer;
