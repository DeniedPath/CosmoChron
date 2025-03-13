
import React, { useState, useEffect, useRef } from 'react';
import { InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

  // Breathing cycle durations (in ms)
  const durations = {
    inhale: 4000,
    hold: 2000,
    exhale: 4000,
    rest: 1000
  };

  // Reset the breathing guide
  const resetBreathing = () => {
    setBreathingState('inactive');
    setProgress(0);
    setCurrentCycle(0);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  // Start the breathing cycle
  const startBreathing = () => {
    setIsOpen(true);
    setBreathingState('inhale');
    setCurrentCycle(1);
    breathingAnimation('inhale', Date.now(), 0);
  };

  // Handle the animation frame
  const breathingAnimation = (state: BreathingState, startTime: number, initialProgress: number) => {
    if (state === 'inactive') return;
    
    const duration = durations[state];
    const elapsed = Date.now() - startTime;
    const newProgress = initialProgress + (elapsed / duration) * 100;
    
    if (newProgress >= 100) {
      // Determine the next state
      let nextState: BreathingState;
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
            setIsOpen(false);
            onComplete?.();
            return;
          } else {
            nextState = 'rest';
          }
          break;
        case 'rest':
          nextState = 'inhale';
          nextCycle = currentCycle + 1;
          setCurrentCycle(nextCycle);
          break;
        default:
          nextState = 'inactive';
      }
      
      setBreathingState(nextState);
      setProgress(0);
      
      if (nextState !== 'inactive') {
        breathingAnimation(nextState, Date.now(), 0);
      }
    } else {
      setProgress(newProgress);
      animationRef.current = requestAnimationFrame(() => {
        breathingAnimation(state, startTime, initialProgress);
      });
    }
  };

  // Handle changes to active state
  useEffect(() => {
    if (active && breathingState === 'inactive') {
      startBreathing();
    } else if (!active && breathingState !== 'inactive') {
      resetBreathing();
    }
    
    return () => {
      resetBreathing();
    };
  }, [active]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => startBreathing()}
        className="rounded-full p-2 bg-cosmic-blue/30 hover:bg-cosmic-blue/40 transition-colors border border-cosmic-highlight/30"
        aria-label="Start breathing exercise"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-6 w-6 flex items-center justify-center">
                <div className="h-2 w-2 bg-cosmic-highlight rounded-full animate-pulse" />
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

  const maxSize = 120;
  const minSize = 40;
  
  // Calculate the current size based on breathing state and progress
  let currentSize = minSize;
  
  if (breathingState === 'inhale') {
    currentSize = minSize + ((maxSize - minSize) * (progress / 100));
  } else if (breathingState === 'hold') {
    currentSize = maxSize;
  } else if (breathingState === 'exhale') {
    currentSize = maxSize - ((maxSize - minSize) * (progress / 100));
  } else if (breathingState === 'rest') {
    currentSize = minSize;
  }

  const getMessage = () => {
    switch (breathingState) {
      case 'inhale': return 'Breathe in...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe out...';
      case 'rest': return 'Rest...';
      default: return '';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="mb-2 text-cosmic-white/70 text-sm">{`Cycle ${currentCycle}/${cycles}`}</div>
      
      <div className="relative flex items-center justify-center h-40 w-40">
        {/* Background pulse effect */}
        <div 
          className="absolute rounded-full bg-cosmic-purple/10 border border-cosmic-highlight/20 transition-all duration-1000"
          style={{
            width: `${currentSize + 30}px`,
            height: `${currentSize + 30}px`,
            opacity: breathingState === 'inhale' ? 0.6 : 0.2
          }}
        />
        
        {/* Main breathing circle */}
        <div 
          className="rounded-full bg-cosmic-purple/30 backdrop-blur-sm border border-cosmic-highlight/40 flex items-center justify-center transition-all"
          style={{
            width: `${currentSize}px`,
            height: `${currentSize}px`,
            transitionDuration: breathingState === 'hold' || breathingState === 'rest' ? '0.5s' : '4s',
            transitionTimingFunction: breathingState === 'inhale' ? 'ease-in' : 'ease-out'
          }}
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
