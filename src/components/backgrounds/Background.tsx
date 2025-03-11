
import React, { useEffect, useState } from 'react';

interface BackgroundProps {
  timerRunning: boolean;
}

const Background: React.FC<BackgroundProps> = ({ timerRunning }) => {
  const [stars, setStars] = useState<Array<{ id: number; size: number; top: string; left: string; delay: string }>>([]);

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const newStars = [];
      const starCount = Math.floor(window.innerWidth * window.innerHeight / 5000);
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          size: Math.random() * 3,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 3}s`
        });
      }
      
      setStars(newStars);
    };

    generateStars();

    // Regenerate on window resize
    window.addEventListener('resize', generateStars);
    
    return () => {
      window.removeEventListener('resize', generateStars);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-space-gradient overflow-hidden -z-10">
      {/* Dynamic starfield */}
      <div className="absolute inset-0 bg-stars opacity-80"></div>
      
      {/* Individual glowing stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.7)`
          }}
        />
      ))}
      
      {/* Nebula glow */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-nebula-gradient opacity-5"></div>
      
      {/* Cosmic energy when timer is running */}
      {timerRunning && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cosmic-glow opacity-10 animate-pulse-subtle"></div>
      )}
      
      {/* Distant planets */}
      <div 
        className="planet bg-cosmic-nebula-purple opacity-60 animate-float"
        style={{ 
          width: '50px', 
          height: '50px', 
          top: '15%', 
          right: '10%',
          boxShadow: '0 0 20px rgba(91, 42, 134, 0.6)'
        }}
      />
      
      <div 
        className="planet bg-cosmic-mars-red opacity-40 animate-float"
        style={{ 
          width: '30px', 
          height: '30px', 
          bottom: '20%', 
          left: '7%',
          animationDelay: '2s',
          boxShadow: '0 0 15px rgba(214, 34, 70, 0.5)'
        }}
      />
      
      <div 
        className="planet bg-cosmic-celestial-blue opacity-50 animate-float"
        style={{ 
          width: '70px', 
          height: '70px', 
          bottom: '10%', 
          right: '20%',
          animationDelay: '1s',
          boxShadow: '0 0 30px rgba(58, 134, 255, 0.5)'
        }}
      />
    </div>
  );
};

export default Background;
