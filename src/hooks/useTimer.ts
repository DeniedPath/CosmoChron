
import { useState, useEffect, useCallback, useRef } from 'react';
import { formatTime, saveSession } from '../utils/timerUtils';
import { updateSessionMissions } from '../utils/missionUtils';

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

interface UseTimerProps {
  initialTime?: number;
  onComplete?: () => void;
}

const useTimer = ({ initialTime = 25 * 60, onComplete }: UseTimerProps = {}) => {
  const [time, setTime] = useState(initialTime);
  const [state, setState] = useState<TimerState>('idle');
  const [totalTime, setTotalTime] = useState(initialTime);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Reset timer to initial state
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTime(initialTime);
    setTotalTime(initialTime);
    setState('idle');
    startTimeRef.current = null;
  }, [initialTime]);
  
  // Set a custom time
  const setCustomTime = useCallback((minutes: number) => {
    const newTime = minutes * 60;
    setTime(newTime);
    setTotalTime(newTime);
    setState('idle');
  }, []);
  
  // Start the timer
  const start = useCallback(() => {
    if (state === 'running') return;
    
    setState('running');
    startTimeRef.current = Date.now() - ((totalTime - time) * 1000);
    
    intervalRef.current = window.setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current!);
          setState('completed');
          onComplete?.();
          
          // Save completed session
          const durationMinutes = Math.floor(totalTime / 60);
          saveSession(durationMinutes, true);

          // Update missions
          updateSessionMissions(durationMinutes, true);
          
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [state, time, totalTime, onComplete]);
  
  // Pause the timer
  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState('paused');
  }, []);
  
  // Resume the timer
  const resume = useCallback(() => {
    if (state !== 'paused') return;
    start();
  }, [state, start]);
  
  // Skip the timer (mark as incomplete)
  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Save incomplete session if timer was running
    if (state === 'running' || state === 'paused') {
      const durationMinutes = Math.floor((totalTime - time) / 60);
      if (durationMinutes > 0) {
        saveSession(durationMinutes, false);
      }
    }
    
    reset();
  }, [state, time, totalTime, reset]);
  
  // Formatted time (MM:SS)
  const formattedTime = formatTime(time);
  
  // Calculate progress percentage
  const progress = ((totalTime - time) / totalTime) * 100;
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return {
    time,
    formattedTime,
    state,
    progress,
    totalTime,
    actions: {
      start,
      pause,
      resume,
      reset,
      skip,
      setCustomTime
    }
  };
};

export default useTimer;
