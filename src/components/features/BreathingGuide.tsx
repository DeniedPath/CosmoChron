import React, { useState, useEffect } from 'react';
import { LucideIcon, Wind } from 'lucide-react';

interface BreathingGuideProps {
  isActive: boolean;
  onToggle: () => void;
}

const BreathingGuide: React.FC<BreathingGuideProps> = ({ isActive, onToggle }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [counter, setCounter] = useState(0);
  
  useEffect(() => {
    if (!isActive) {
      setPhase('rest');
      setCounter(0);
      return;
    }
    
    const breathingCycle = () => {
      if (phase === 'rest' || phase === 'exhale') {
        setPhase('inhale');
        setCounter(4); // 4 seconds inhale
      } else if (phase === 'inhale') {
        setPhase('hold');
        setCounter(7); // 7 seconds hold
      } else if (phase === 'hold') {
        setPhase('exhale');
        setCounter(8); // 8 seconds exhale
      }
    };
    
    const timer = setInterval(() => {
      if (counter > 0) {
        setCounter(c => c - 1);
      } else {
        breathingCycle();
      }
    }, 1000);
    
    if (phase === 'rest') {
      breathingCycle();
    }
    
    return () => clearInterval(timer);
  }, [isActive, phase, counter]);
  
  const getInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Start Breathing';
    }
  };
  
  return (
    <div className="cosmic-card relative overflow-hidden">
      <button
        onClick={onToggle}
        className="absolute top-4 right-4 cosmic-button-secondary p-2 rounded-full"
        aria-label={isActive ? "Stop breathing guide" : "Start breathing guide"}
      >
        <Wind className="w-4 h-4" />
      </button>
      
      <div className="flex flex-col items-center p-6">
        <h3 className="text-xl font-medium mb-4">Breathing Guide</h3>
        
        {isActive ? (
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-6">
              <div 
                className={`absolute inset-0 rounded-full bg-nebula-blue/30 transition-transform duration-1000 ease-in-out ${
                  phase === 'inhale' 
                    ? 'scale-100 animate-breathe' 
                    : phase === 'hold' 
                      ? 'scale-100' 
                      : 'scale-75'
                }`}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-light">
                {counter}
              </div>
            </div>
            
            <p className="text-lg">{getInstruction()}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">
              Take a moment to breathe and focus with our guided breathing exercise.
            </p>
            <button onClick={onToggle} className="cosmic-button">
              Start Breathing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreathingGuide;
