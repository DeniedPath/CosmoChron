
import React, { useEffect, useState } from 'react';

interface ShootingStarProps {
  delay?: number;
  duration?: number;
  top?: string;
  left?: string;
  angle?: number;
  size?: number;
}

const ShootingStar: React.FC<ShootingStarProps> = ({
  delay = 0,
  duration = 2,
  top = '10%',
  left = '20%',
  angle = 45,
  size = 100
}) => {
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
          background: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))',
          borderRadius: '50%',
          boxShadow: '0 0 20px 4px rgba(255, 255, 255, 0.7)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: '0 0 10px 4px rgba(255, 255, 255, 0.9)',
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
      opacity: 0;
      transform: rotate(var(--angle, 45deg)) translateX(0);
    }
    10% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: rotate(var(--angle, 45deg)) translateX(200px);
    }
  }
`;

const ShootingStars: React.FC = () => {
  const [stars, setStars] = useState<ShootingStarProps[]>([]);

  // Generate a new shooting star
  const generateShootingStar = () => {
    const newStar: ShootingStarProps = {
      delay: 0,
      duration: Math.random() * 2 + 1,
      top: `${Math.random() * 70}%`,
      left: `${Math.random() * 70}%`,
      angle: Math.random() * 60 - 30,
      size: Math.random() * 150 + 50
    };
    
    return newStar;
  };

  // Create initial batch of shooting stars
  useEffect(() => {
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
  }, []);

  // Insert the keyframes animation using a style tag
  useEffect(() => {
    // Create style element for shooting star keyframes
    const styleElement = document.createElement('style');
    styleElement.innerHTML = shootingStarKeyframes;
    document.head.appendChild(styleElement);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
        />
      ))}
    </div>
  );
};

export default ShootingStars;
