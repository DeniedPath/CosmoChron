"use client";

import React, { useEffect, useState, useCallback } from 'react';

interface ShootingStarProps {
  delay?: number;
  duration?: number;
  top?: string;
  left?: string;
  angle?: number;
  size?: number;
  brightness?: number;
}

const ShootingStar: React.FC<ShootingStarProps> = ({
  delay = 0,
  duration = 2,
  top = '10%',
  left = '20%',
  angle = 45,
  size = 100,
  brightness = 0.7
}) => {
  // Calculate glow intensity based on brightness
  const opacity = 0.2 + (brightness * 0.8);

  const glowSize = 2 + (brightness * 6);
  
  return (
    <div
      className="absolute"
      style={{
        top,
        left,
        transformOrigin: 'center left',
        transform: `rotate(${angle}deg)`,
        opacity: 0,
        animation: `shooting-star ${duration}s linear ${delay}s forwards`,
        '--angle': `${angle}deg`,
      } as React.CSSProperties}
    >
      <div
        style={{
          width: `${size}px`,
          height: '2px',
          background: `linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, ${opacity}))`,
          borderRadius: '50%',
          boxShadow: `0 0 ${glowSize}px ${glowSize / 2}px rgba(255, 255, 255, ${opacity})`,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '-3px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: `rgba(255, 255, 255, ${opacity})`,
            boxShadow: `0 0 ${glowSize * 1.5}px ${glowSize}px rgba(255, 255, 255, ${opacity})`,
          }}
        />
      </div>
    </div>
  );
};

// Create a keyframes animation via CSS class instead of using style jsx
const shootingStarKeyframes = `
  @keyframes shooting-star {
    0% {
      opacity: 1;
      transform: rotate(var(--angle, 45deg)) translateX(0);
    }
    100% {
      opacity: 0;
      transform: rotate(var(--angle, 45deg)) translateX(200px);
    }
  }
`;

interface ShootingStarsProps {
  brightness?: number;
}

const ShootingStars: React.FC<ShootingStarsProps> = ({ brightness = 0.75 }) => {
  const [stars, setStars] = useState<ShootingStarProps[]>([]);
  const [isClient, setIsClient] = useState(false);
 
  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Generate a new shooting star
  const generateShootingStar = useCallback(() => {
    const newStar: ShootingStarProps = {
      delay: 0,
      duration: Math.random() * 2 + 1,
      top: `${Math.random() * 70}%`,
      left: `${Math.random() * 70}%`,
      angle: Math.random() * 60 - 30,
      size: Math.random() * 150 + 50,
      brightness
    };
    
    return newStar;
  }, [brightness]);

  // Create initial batch of shooting stars
  useEffect(() => {
    if (!isClient) return; // Only run on client side
    
    const initialStars = [];
    for (let i = 0; i < 10; i++) {
      const star = generateShootingStar();
      star.delay = Math.random() * 30; // Spread initial stars over time
      initialStars.push(star);
    }
    
    setStars(initialStars);

    // Add new shooting stars periodically
    const interval = setInterval(() => {
      setStars(prevStars => {
        const newStar = generateShootingStar();
        return [...prevStars.slice(-15), newStar]; // Keep only the last 15 stars
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [brightness, generateShootingStar, isClient]); // Add isClient to dependency array

  // Insert the keyframes animation using a style tag
  useEffect(() => {
    if (!isClient) return; // Only run on client side
    
    // Create style element for shooting star keyframes
    const styleElement = document.createElement('style');
    styleElement.innerHTML = shootingStarKeyframes;
    document.head.appendChild(styleElement);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [isClient]);

  // Return empty div for server-side rendering to avoid hydration mismatch
  if (!isClient) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, index) => (
        <ShootingStar
        key={`shooting-star-${index}-${star.delay}`}
        delay={star.delay}
        duration={star.duration}
        top={star.top}
        left={star.left}
        angle={star.angle}
        size={star.size}
        brightness={brightness}
        />
      ))}
    </div>
  );
};

export default ShootingStars;
