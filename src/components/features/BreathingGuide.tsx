"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { InfoIcon, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface BreathingGuideProps {
  active: boolean;
  onComplete?: () => void;
  cycles?: number;
}

type BreathingState = 'inhale' | 'hold' | 'exhale' | 'rest' | 'inactive';

const BreathingGuide: React.FC<BreathingGuideProps> = ({ 
  active = false, 
  onComplete,
  cycles = 3
}) => {
  const [breathingState, setBreathingState] = useState<BreathingState>('inactive');
  const [progress, setProgress] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingRef = useRef(false);

  // Breathing cycle durations (in ms) - memoized to prevent recreation
  const durations = useMemo(() => ({
    inhale: 4000,
    hold: 2000,
    exhale: 4000,
    rest: 1000
  }), []);

  // Reset the breathing guide
  const resetBreathing = useCallback(() => {
    if (isAnimatingRef.current) {
      isAnimatingRef.current = false;
      setBreathingState('inactive');
      setProgress(0);
      setCurrentCycle(0);
      setIsOpen(false);
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, []);

  // Handle the animation frame - completely rewritten to avoid state updates in tight loops
  const breathingAnimation = useCallback((state: BreathingState, startTime: number, initialProgress: number) => {
    // If we're not animating anymore, don't proceed
    if (!isAnimatingRef.current || state === 'inactive') return;
    
    const duration = durations[state];
    const elapsed = Date.now() - startTime;
    const newProgress = initialProgress + (elapsed / duration) * 100;
    
    if (newProgress >= 100) {
      // Animation for this state is complete, determine the next state
      let nextState: BreathingState = 'inactive';
      let nextCycle = currentCycle;
      
      switch (state) {
        case 'inhale':
          nextState = 'hold';
          break;
        case 'hold':
          nextState = 'exhale';
          break;
        case 'exhale':
          if (currentCycle >= cycles) {
            nextState = 'inactive';
            isAnimatingRef.current = false;
            
            // Use RAF to batch these state updates
            requestAnimationFrame(() => {
              setIsOpen(false);
              setBreathingState('inactive');
              if (onComplete) onComplete();
            });
            return;
          } else {
            nextState = 'rest';
          }
          break;
        case 'rest':
          nextState = 'inhale';
          nextCycle = currentCycle + 1;
          
          // Update cycle in a separate RAF call
          requestAnimationFrame(() => {
            setCurrentCycle(nextCycle);
          });
          break;
      }
      
      // Update state and progress in a batched update
      requestAnimationFrame(() => {
        setBreathingState(nextState);
        setProgress(0);
      });
      
      // Schedule the next animation frame after a small delay
      if (nextState !== 'inactive' && isAnimatingRef.current) {
        timerRef.current = setTimeout(() => {
          if (isAnimatingRef.current) {
            breathingAnimation(nextState, Date.now(), 0);
          }
        }, 50); // Small delay to prevent tight loops
      }
    } else {
      // Continue the current animation
      requestAnimationFrame(() => {
        setProgress(newProgress);
      });
      
      // Schedule the next animation frame
      if (isAnimatingRef.current) {
        animationRef.current = requestAnimationFrame(() => {
          breathingAnimation(state, startTime, initialProgress);
        });
      }
    }
  }, [currentCycle, cycles, durations, onComplete]);

  // Start the breathing cycle
  const startBreathing = useCallback(() => {
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      
      // Use RAF to batch state updates
      requestAnimationFrame(() => {
        setIsOpen(true);
        setBreathingState('inhale');
        setCurrentCycle(1);
        setProgress(0);
      });
      
      // Delay starting the animation to avoid tight loops
      timerRef.current = setTimeout(() => {
        if (isAnimatingRef.current) {
          breathingAnimation('inhale', Date.now(), 0);
        }
      }, 100);
    }
  }, [breathingAnimation]);

  // Handle changes to active state
  useEffect(() => {
    if (active && breathingState === 'inactive' && !isAnimatingRef.current) {
      startBreathing();
    } else if (!active && breathingState !== 'inactive') {
      resetBreathing();
    }
    
    return () => {
      isAnimatingRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [active, breathingState, startBreathing, resetBreathing]);

  // Message to display based on breathing state
  const getMessage = useCallback(() => {
    switch (breathingState) {
      case 'inhale': return 'Breathe in...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe out...';
      case 'rest': return 'Rest...';
      default: return '';
    }
  }, [breathingState]);

  // Calculate the current size based on breathing state and progress
  const currentSize = useMemo(() => {
    const maxSize = 120;
    const minSize = 40;
    
    if (breathingState === 'inhale') {
      return minSize + ((maxSize - minSize) * (progress / 100));
    } else if (breathingState === 'hold') {
      return maxSize;
    } else if (breathingState === 'exhale') {
      return maxSize - ((maxSize - minSize) * (progress / 100));
    } else if (breathingState === 'rest') {
      return minSize;
    }
    
    return minSize;
  }, [breathingState, progress]);

  // Style for the background pulse effect
  const backgroundStyle = useMemo(() => ({
    width: `${currentSize + 30}px`,
    height: `${currentSize + 30}px`,
    opacity: breathingState === 'inhale' ? 0.6 : 0.2
  }), [currentSize, breathingState]);

  // Style for the main breathing circle
  const circleStyle = useMemo(() => ({
    width: `${currentSize}px`,
    height: `${currentSize}px`,
    transitionDuration: breathingState === 'hold' || breathingState === 'rest' ? '0.5s' : '4s',
    transitionTimingFunction: breathingState === 'inhale' ? 'ease-in' : 'ease-out'
  }), [currentSize, breathingState]);

  if (!isOpen) {
    return (
      <button 
        onClick={startBreathing}
        className="rounded-full p-2 bg-cosmic-blue/30 hover:bg-cosmic-blue/40 transition-colors border border-cosmic-gold"
        aria-label="Start breathing exercise"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-6 w-6 flex items-center justify-center">
                <div className="h-2 w-2 bg-cosmic-gold rounded-full animate-pulse" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start breathing exercise</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </button>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="flex justify-between items-center w-full mb-2">
        <div className="text-cosmic-white/70 text-sm">{`Cycle ${currentCycle}/${cycles}`}</div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full bg-cosmic-blue/20 hover:bg-cosmic-blue/30 text-cosmic-white/70"
          onClick={resetBreathing}
          aria-label="Stop breathing exercise"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="relative flex items-center justify-center h-40 w-40">
        {/* Background pulse effect */}
        <div 
          className="absolute rounded-full bg-cosmic-purple/10 border border-cosmic-highlight/20 transition-all duration-1000"
          style={backgroundStyle}
        />
        
        {/* Main breathing circle */}
        <div 
          className="rounded-full bg-cosmic-purple/30 backdrop-blur-sm border border-cosmic-highlight/40 flex items-center justify-center transition-all"
          style={circleStyle}
        >
          <div className="text-center text-cosmic-white">
            {getMessage()}
          </div>
        </div>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-3 flex items-center text-xs text-cosmic-white/50 cursor-help">
              <InfoIcon className="h-3 w-3 mr-1" />
              <span>4-2-4 Breathing</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>4 seconds inhale, 2 seconds hold, 4 seconds exhale</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default BreathingGuide;
