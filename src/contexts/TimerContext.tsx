"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { formatTime, saveSession } from '@/utils/timerUtils';
import { updateSessionMissions } from '@/utils/missionUtils';
import { toast } from '@/hooks/use-toast';

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

interface TimerContextType {
  time: number;
  formattedTime: string;
  state: TimerState;
  progress: number;
  totalTime: number;
  isTimerVisible: boolean;
  isAlarmPlaying: boolean;
  actions: {
    start: () => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
    skip: () => void;
    setCustomTime: (minutes: number) => void;
    toggleTimerVisibility: () => void;
    stopAlarm: () => void;
  };
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
  children: React.ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Check localStorage for saved timer state
  const getInitialState = () => {
    if (typeof window === 'undefined') return { time: 25 * 60, state: 'idle' as TimerState, totalTime: 25 * 60 };
    
    const savedTimer = localStorage.getItem('spaceTimer');
    if (savedTimer) {
      try {
        const { time, state, totalTime, timestamp } = JSON.parse(savedTimer);
        
        // If the timer was running, calculate elapsed time since last save
        if (state === 'running' && timestamp) {
          const elapsedSeconds = Math.floor((Date.now() - timestamp) / 1000);
          const newTime = Math.max(0, time - elapsedSeconds);
          
          // If timer should have completed while away
          if (newTime <= 0) {
            return { time: 0, state: 'completed' as TimerState, totalTime };
          }
          
          return { time: newTime, state: 'running' as TimerState, totalTime };
        }
        
        return { time, state: state as TimerState, totalTime };
      } catch (error) {
        console.error('Error parsing saved timer:', error);
        return { time: 25 * 60, state: 'idle' as TimerState, totalTime: 25 * 60 };
      }
    }
    
    return { time: 25 * 60, state: 'idle' as TimerState, totalTime: 25 * 60 };
  };

  const defaultState = { time: 25 * 60, state: 'idle' as TimerState, totalTime: 25 * 60 };
  const [time, setTime] = useState(defaultState.time);
  const [state, setState] = useState<TimerState>(defaultState.state);
  const [totalTime, setTotalTime] = useState(defaultState.totalTime);
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Handle timer completion
  const handleComplete = useCallback(() => {
    if (!isClient) return;
    
    // Show success notification
    toast({
      title: "Focus Session Completed!",
      description: "Great job! Take a short break before your next session.",
      duration: 5000,
    });
    
    // Save completed session
    const durationMinutes = Math.floor(totalTime / 60);
    saveSession(durationMinutes, true);

    // Update missions
    updateSessionMissions(durationMinutes, true);
    
    // Play sound if browser supports it
    try {
      alarmAudioRef.current = new Audio('/alarm.mp3');
      alarmAudioRef.current.volume = 0.3;
      alarmAudioRef.current.play().catch(() => {
        console.log('Audio autoplay was prevented');
      });
      setIsAlarmPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }, [totalTime, isClient]);

  // Initialize state from localStorage only on client-side
  useEffect(() => {
    setIsClient(true);
    const initialState = getInitialState();
    setTime(initialState.time);
    setState(initialState.state);
    setTotalTime(initialState.totalTime);
    
    // If timer was running, restart it
    if (initialState.state === 'running') {
      startTimeRef.current = Date.now() - ((initialState.totalTime - initialState.time) * 1000);
      
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime: number) => {
          if (prevTime <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setState('completed');
            handleComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  }, [handleComplete]);

  // Save timer state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && isClient) {
      localStorage.setItem('spaceTimer', JSON.stringify({
        time,
        state,
        totalTime,
        timestamp: state === 'running' ? Date.now() : null
      }));
    }
  }, [time, state, totalTime, isClient]);

  // Reset timer to initial state
  const reset = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset to default time
    const defaultTime = 25 * 60;
    setTime(defaultTime);
    setTotalTime(defaultTime);
    setState('idle');
    startTimeRef.current = null;
    
    // Update localStorage immediately to prevent state conflicts
    if (typeof window !== 'undefined' && isClient) {
      localStorage.setItem('spaceTimer', JSON.stringify({
        time: defaultTime,
        state: 'idle',
        totalTime: defaultTime,
        timestamp: null
      }));
    }
  }, [isClient]);
  
  // Set a custom time
  const setCustomTime = useCallback((minutes: number) => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Set new time values
    const newTime = minutes * 60;
    setTime(newTime);
    setTotalTime(newTime);
    
    // Ensure timer is in idle state
    setState('idle');
    startTimeRef.current = null;
    
    // Update localStorage immediately to prevent state conflicts
    if (typeof window !== 'undefined' && isClient) {
      localStorage.setItem('spaceTimer', JSON.stringify({
        time: newTime,
        state: 'idle',
        totalTime: newTime,
        timestamp: null
      }));
    }
  }, [isClient]);
  
  // Start the timer
  const start = useCallback(() => {
    if (state === 'running' || !isClient) return;
    
    setState('running');
    startTimeRef.current = Date.now() - ((totalTime - time) * 1000);
    
    intervalRef.current = window.setInterval(() => {
      setTime((prevTime: number) => {
        if (prevTime <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setState('completed');
          handleComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [state, time, totalTime, handleComplete, isClient]);
  
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
    if (state !== 'paused' || !isClient) return;
    start();
  }, [state, start, isClient]);
  
  // Skip the timer (mark as incomplete)
  const skip = useCallback(() => {
    if (!isClient) return;
    
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
  }, [state, time, totalTime, reset, isClient]);

  // Toggle timer visibility
  const toggleTimerVisibility = useCallback(() => {
    setIsTimerVisible(prev => !prev);
  }, []);
  
  // Stop alarm sound
  const stopAlarm = useCallback(() => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
      setIsAlarmPlaying(false);
    }
  }, []);

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

  // Provide context values
  const contextValue = useMemo(() => ({
    time,
    formattedTime,
    state,
    progress,
    totalTime,
    isTimerVisible,
    isAlarmPlaying,
    actions: {
      start,
      pause,
      resume,
      reset,
      skip,
      setCustomTime,
      toggleTimerVisibility,
      stopAlarm
    }
  }), [
    time, 
    formattedTime, 
    state, 
    progress, 
    totalTime, 
    isTimerVisible,
    isAlarmPlaying,
    start,
    pause,
    resume,
    reset,
    skip,
    setCustomTime,
    toggleTimerVisibility,
    stopAlarm
  ]);

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  );
};

export const useGlobalTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useGlobalTimer must be used within a TimerProvider');
  }
  return context;
};
