
import React, { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';

interface IntroAnimationProps {
  show: boolean;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ show }) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  if (!show) return null;
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-cosmic-dark transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center animate-fade-in">
        <div className="mb-4 flex justify-center">
          <Rocket className="w-16 h-16 text-cosmic-highlight animate-pulse-subtle" />
        </div>
        <h1 className="text-4xl font-bold text-cosmic-highlight mb-2">Space Timer</h1>
        <p className="text-white">Your cosmic focus journey awaits</p>
      </div>
    </div>
  );
};

export default IntroAnimation;
