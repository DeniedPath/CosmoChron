
import React, { useState, useEffect } from 'react';
import useTimer from '@/hooks/useTimer';
import TimerControls from './TimerControls';
import SpaceParticles from '../space/SpaceParticles';
import BreathingGuide from '../features/BreathingGuide';
import Notepad from '../features/Notepad';
import { formatTime, getRandomSpaceFact } from '@/utils/timerUtils';
import { updateSessionMissions, completeBreathingGuideMission, resetDailyMissions, resetWeeklyMissions } from '@/utils/missionUtils';
import { toast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { ArrowRight, Stars } from 'lucide-react';

const Timer = () => {
  const [spaceFact, setSpaceFact] = useState<string>('');
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const [particleType, setParticleType] = useState<'stars' | 'cosmic' | 'meteor'>('stars');
  
  // Initialize timer
  const { 
    formattedTime, 
    state, 
    progress,
    actions: { start, pause, reset, skip, setCustomTime }
  } = useTimer({
    initialTime: 25 * 60,
    onComplete: () => {
      // Show success notification
      toast({
        title: "Focus Session Completed!",
        description: "Great job! Take a short break before your next session.",
        duration: 5000,
      });
      
      // Show a space fact
      setSpaceFact(getRandomSpaceFact());
      
      // Update missions
      updateSessionMissions(25, true);
    }
  });
  
  // Size calculations for timer display
  const circumference = 2 * Math.PI * 120; // 120 is the radius
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Handle timer completion
  useEffect(() => {
    if (state === 'completed') {
      // Play sound or trigger other effects
      const audio = new Audio('/completion-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Handle browsers that block autoplay
        console.log('Audio autoplay was prevented');
      });
    }
  }, [state]);
  
  // Reset daily/weekly missions when needed
  useEffect(() => {
    resetDailyMissions();
    resetWeeklyMissions();
  }, []);
  
  // Toggle breathing guide
  const toggleBreathingGuide = () => {
    const newState = !showBreathingGuide;
    setShowBreathingGuide(newState);
    
    // Track mission progress if breathing guide is used
    if (newState) {
      completeBreathingGuideMission();
    }
  };
  
  // Change particle effect
  const cycleParticleEffect = () => {
    if (particleType === 'stars') setParticleType('cosmic');
    else if (particleType === 'cosmic') setParticleType('meteor');
    else setParticleType('stars');
  };
  
  return (
    <div className="relative flex flex-col items-center justify-center space-y-8 pt-6 pb-8">
      {/* Visual Controls */}
      <div className="absolute top-0 right-4 flex space-x-2">
        <Button
          onClick={toggleBreathingGuide}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-cosmic-blue/20 hover:bg-cosmic-blue/30 text-cosmic-white/70"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={cycleParticleEffect}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-cosmic-blue/20 hover:bg-cosmic-blue/30 text-cosmic-white/70"
        >
          <Stars className="h-4 w-4" />
        </Button>
        
        <Notepad />
      </div>
      
      {/* Timer Display */}
      <div className="relative flex items-center justify-center w-72 h-72">
        {/* Background circle */}
        <svg className="absolute" width="280" height="280" viewBox="0 0 280 280">
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            strokeWidth="4"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Progress circle */}
        <svg className="absolute" width="280" height="280" viewBox="0 0 280 280">
          <circle
            className="timer-ring"
            cx="140"
            cy="140"
            r="120"
            fill="none"
            strokeWidth="4"
            stroke="url(#progressGradient)"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9277FF" />
              <stop offset="100%" stopColor="#6E56CF" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Particles effect */}
        <SpaceParticles 
          active={state === 'running'} 
          intensity={state === 'running' ? 'medium' : 'low'} 
          particleType={particleType} 
        />
        
        {/* Timer display or breathing guide */}
        {showBreathingGuide ? (
          <div className="z-10">
            <BreathingGuide 
              active={state === 'running'} 
              onComplete={() => setShowBreathingGuide(false)}
            />
          </div>
        ) : (
          <div className="text-center z-10">
            <h1 className="text-6xl font-bold text-cosmic-white tracking-tight">
              {formattedTime}
            </h1>
            <p className="text-cosmic-white/60 text-sm mt-2">
              {state === 'idle' && 'Ready to focus'}
              {state === 'running' && 'Focus in progress'}
              {state === 'paused' && 'Paused'}
              {state === 'completed' && 'Session Complete!'}
            </p>
          </div>
        )}
      </div>
      
      {/* Space Fact (shown on completion) */}
      {state === 'completed' && spaceFact && (
        <div className="cosmic-blur p-4 rounded-xl max-w-md animate-fade-in text-center">
          <p className="text-sm text-cosmic-white/80 italic">"{spaceFact}"</p>
        </div>
      )}
      
      {/* Timer Controls */}
      <TimerControls
        state={state}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
        onTimeChange={setCustomTime}
      />
    </div>
  );
};

export default Timer;
