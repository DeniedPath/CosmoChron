"use client";

import React, { useState, useEffect } from 'react';
import { useGlobalTimer } from '@/contexts/TimerContext';
import TimerControls from './TimerControls';
import BreathingGuide from '../features/BreathingGuide';
import Notepad from '../features/Notepad';
import { getRandomSpaceFact } from '@/utils/timerUtils';
import { completeBreathingGuideMission } from '@/utils/missionUtils';
import { toast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { ArrowRight, VolumeX } from 'lucide-react';

const Timer = () => {
  const [spaceFact, setSpaceFact] = useState<string>('');
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Use global timer context
  const { 
    formattedTime, 
    state, 
    progress,
    isAlarmPlaying,
    actions: { start, pause, reset, skip, setCustomTime, stopAlarm }
  } = useGlobalTimer();
  
  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Size calculations for timer display
  const circumference = 2 * Math.PI * 120; // 120 is the radius
  // Only calculate strokeDashoffset on the client side
  const strokeDashoffset = isClient ? circumference - (progress / 100) * circumference : circumference;
  
  // Handle timer completion
  useEffect(() => {
    if (state === 'completed' && isClient) {
      // Show a space fact
      setSpaceFact(getRandomSpaceFact());
    }
  }, [state, isClient]);
  
  // Handle breathing guide completion
  const handleBreathingComplete = () => {
    setShowBreathingGuide(false);
    completeBreathingGuideMission();
    toast({
      title: "Breathing Exercise Completed",
      description: "Great job! You've completed the breathing exercise.",
      duration: 3000,
    });
  };
  
  // Toggle breathing guide
  const toggleBreathingGuide = () => {
    setShowBreathingGuide(!showBreathingGuide);
  };
  
  return (
    <div className="flex flex-col items-center max-w-full overflow-x-hidden">
      {/* Timer Display */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
          {/* Background circle */}
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="15"
          />
          {/* Progress circle - only render with actual progress on client side */}
          {isClient && (
            <circle
              cx="150"
              cy="150"
              r="120"
              fill="none"
              stroke="rgba(138, 180, 248, 0.8)"
              strokeWidth="15"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl md:text-5xl font-bold text-cosmic-white mb-2">{formattedTime}</span>
          <span className="text-sm text-cosmic-white/70 uppercase tracking-wider">
            {state === 'idle' && 'Ready'}
            {state === 'running' && 'Focusing'}
            {state === 'paused' && 'Paused'}
            {state === 'completed' && 'Completed'}
          </span>
        </div>
      </div>
      
      {/* Timer Controls */}
      <TimerControls 
        state={state}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
        onTimeChange={setCustomTime}
      />
      
      {/* Stop Alarm Button - only shown when alarm is playing */}
      {isAlarmPlaying && (
        <Button 
          onClick={stopAlarm}
          className="mt-4 bg-red-500/70 hover:bg-red-600/90 text-white font-medium"
        >
          <VolumeX className="w-4 h-4 mr-2" />
          Stop Alarm
        </Button>
      )}
      
      {/* Space Fact (shown after completion) */}
      {spaceFact && state === 'completed' && isClient && (
        <div className="bg-cosmic-blue/30 border border-cosmic-gold rounded-lg p-4 max-w-md mb-6 animate-fadeIn">
          <h3 className="text-cosmic-highlight font-medium mb-2">Space Fact</h3>
          <p className="text-cosmic-white/90">{spaceFact}</p>
        </div>
      )}
      
      {/* Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-4xl mt-4 px-2">
        {/* Breathing Guide */}
        <div className="bg-cosmic-blue/20 border border-cosmic-gold rounded-lg p-4">
          <h3 className="text-lg font-medium text-cosmic-white mb-3">Breathing Guide</h3>
          <p className="text-cosmic-white/70 mb-4">Take a moment to breathe and center yourself before or after a focus session.</p>
          
          {showBreathingGuide && isClient ? (
            <BreathingGuide active={true} onComplete={handleBreathingComplete} />
          ) : (
            <Button 
              className="w-full bg-cosmic-purple/60 hover:bg-cosmic-purple/80"
              onClick={toggleBreathingGuide}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Start Breathing Exercise
            </Button>
          )}
        </div>
        
        {/* Notepad */}
        <div className="bg-cosmic-blue/20 border border-cosmic-gold rounded-lg p-4">
          <h3 className="text-lg font-medium text-cosmic-white mb-3">Session Notes</h3>
          <p className="text-cosmic-white/70 mb-4">Jot down your thoughts or tasks for this focus session.</p>
          <Notepad />
        </div>
      </div>
    </div>
  );
};

export default Timer;
