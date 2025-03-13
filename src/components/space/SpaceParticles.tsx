import React, { useEffect, useRef } from 'react';

interface SpaceParticlesProps {
  active?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  particleType?: 'stars' | 'cosmic' | 'meteor' | 'stardust';
}

const SpaceParticles: React.FC<SpaceParticlesProps> = ({ 
  active = true, 
  intensity = 'medium',
  particleType = 'stars'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!active || !containerRef.current) return;
    
    const container = containerRef.current;
    
    // Determine particle count based on intensity
    let particleCount = 100; // default medium
    switch(intensity) {
      case 'low':
        particleCount = 70;
        break;
      case 'medium':
        particleCount = 180;
        break;
      case 'high':
        particleCount = 300;
        break;
    }
    
    // Create particles
    const particles: HTMLDivElement[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Different particle appearances based on type
      if (particleType === 'stars') {
        particle.className = 'absolute rounded-full bg-white animate-pulse-subtle';
        
        // Larger size and increased opacity for stars
        const size = Math.random() * 5 + 2.5;
        const opacity = Math.random() * 0.5 + 0.5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = opacity.toString();
        
        // Add stronger glow effect to stars
        if (Math.random() > 0.3) {
          particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${Math.random() * 5 + 3}px rgba(255, 255, 255, 0.95)`;
        }
        
        // Add colored stars occasionally
        if (Math.random() > 0.85) {
          const colors = [
            'rgba(255, 223, 186, 0.98)', // Yellow/white
            'rgba(203, 249, 255, 0.98)', // Blue
            'rgba(255, 180, 180, 0.98)', // Red
            'rgba(255, 210, 161, 0.98)', // Orange
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          particle.style.backgroundColor = randomColor;
          particle.style.boxShadow = `0 0 ${Math.random() * 15 + 8}px ${Math.random() * 6 + 4}px ${randomColor.replace('0.98', '0.85')}`;
        }
      }
      else if (particleType === 'cosmic') {
        particle.className = 'absolute rounded-full animate-pulse-subtle';
        
        // Larger cosmic particles with higher opacity
        const size = Math.random() * 12 + 6;
        const opacity = Math.random() * 0.7 + 0.5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = opacity.toString();
        
        // Random cosmic particle colors
        const cosmicColors = [
          'bg-gradient-to-br from-purple-300 to-blue-300',
          'bg-gradient-to-br from-blue-300 to-teal-300',
          'bg-gradient-to-br from-pink-300 to-purple-400',
          'bg-gradient-to-br from-indigo-300 to-blue-400',
        ];
        const randomColorClass = cosmicColors[Math.floor(Math.random() * cosmicColors.length)];
        particle.classList.add(...randomColorClass.split(' '));
        
        // Enhanced glow
        particle.style.boxShadow = `0 0 ${Math.random() * 12 + 8}px ${Math.random() * 8 + 4}px rgba(147, 112, 219, 0.8)`;
      }
      else if (particleType === 'meteor') {
        // Brighter meteor particles
        particle.className = 'absolute bg-white/95 animate-meteor';
        
        const width = Math.random() * 150 + 100;
        const height = Math.random() * 5 + 2;
        particle.style.width = `${width}px`;
        particle.style.height = `${height}px`;
        particle.style.transform = `rotate(${Math.random() * 45}deg)`;
        particle.style.boxShadow = '0 0 20px 8px rgba(255, 255, 255, 0.95)';
      }
      else if (particleType === 'stardust') {
        // Small floating dust particles
        particle.className = 'absolute rounded-full';
        
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.3 + 0.1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = opacity.toString();
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        
        // Very subtle glow
        if (Math.random() > 0.7) {
          particle.style.boxShadow = `0 0 ${Math.random() * 3 + 1}px rgba(255, 255, 255, 0.5)`;
        }
      }
      
      // Random positions
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random animation duration
      const duration = Math.random() * 15 + 10;
      
      if (particleType === 'meteor') {
        // Meteors have special animation
        particle.style.animation = `meteor ${duration}s linear infinite`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
      } else if (particleType === 'stardust') {
        // Stardust floats slowly
        particle.style.animation = `float ${duration * 2}s infinite`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
      } else {
        // Add twinkle and float animations for stars and cosmic particles
        particle.style.animation = `pulse-subtle ${duration}s infinite, float ${duration * 1.5}s infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
      }
      
      // Add to container
      container.appendChild(particle);
      particles.push(particle);
    }
    
    // Cleanup
    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, [active, intensity, particleType]);
  
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-10"
    />
  );
};

export default SpaceParticles;
