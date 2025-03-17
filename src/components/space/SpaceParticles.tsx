"use client";

import React, { useEffect, useRef, useState } from 'react';

interface SpaceParticlesProps {
  active?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  particleType?: 'stars' | 'cosmic' | 'meteor' | 'stardust';
  brightness?: 'dim' | 'normal' | 'bright'; 
}

const SpaceParticles: React.FC<SpaceParticlesProps> = ({ 
  active = true, 
  intensity = 'medium',
  particleType = 'stars',
  brightness = 'normal' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!active || !containerRef.current || !isClient) return;
    
    const container = containerRef.current;
    
    let particleCount = 100; 
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
    
    const particles: HTMLDivElement[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      if (particleType === 'stars') {
        particle.className = 'absolute rounded-full bg-white animate-pulse-subtle';
        
        const size = Math.random() * 5 + 2.5;
        const opacity = Math.random() * 0.5 + 0.5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = opacity.toString();
        
        if (Math.random() > 0.3) {
          particle.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${Math.random() * 5 + 3}px rgba(255, 255, 255, 0.95)`;
        }
        
        if (Math.random() > 0.85) {
          const colors = [
            'rgba(255, 223, 186, 0.98)', 
            'rgba(203, 249, 255, 0.98)', 
            'rgba(255, 180, 180, 0.98)', 
            'rgba(255, 210, 161, 0.98)', 
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          particle.style.backgroundColor = randomColor;
          particle.style.boxShadow = `0 0 ${Math.random() * 15 + 8}px ${Math.random() * 6 + 4}px ${randomColor.replace('0.98', '0.85')}`;
        }
      }
      else if (particleType === 'cosmic') {
        particle.className = 'absolute rounded-full animate-pulse-subtle';
        
        const size = Math.random() * 12 + 6;
        const opacity = Math.random() * 0.7 + 0.5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = opacity.toString();
        
        const cosmicColors = [
          'bg-gradient-to-br from-purple-300 to-blue-300',
          'bg-gradient-to-br from-blue-300 to-teal-300',
          'bg-gradient-to-br from-pink-300 to-purple-400',
          'bg-gradient-to-br from-indigo-300 to-blue-400',
        ];
        const randomColorClass = cosmicColors[Math.floor(Math.random() * cosmicColors.length)];
        particle.classList.add(...randomColorClass.split(' '));
        
        particle.style.boxShadow = `0 0 ${Math.random() * 12 + 8}px ${Math.random() * 8 + 4}px rgba(147, 112, 219, 0.8)`;
      }
      else if (particleType === 'meteor') {
        let opacity = 0.6; 
        let glowIntensity = 0.5; 
        
        switch(brightness) {
          case 'dim':
            opacity = 0.3;
            glowIntensity = 0.2;
            if (Math.random() > 0.6) continue; 
            break;
          case 'normal':
            opacity = 0.6;
            glowIntensity = 0.5;
            break;
          case 'bright':
            opacity = 0.95;
            glowIntensity = 0.8;
            break;
        }
        
        particle.className = 'absolute bg-white animate-meteor';
        
        const width = Math.random() * 120 + 80;
        const height = Math.random() * 3 + 1; 
        
        particle.style.width = `${width}px`;
        particle.style.height = `${height}px`;
        particle.style.opacity = opacity.toString();
        particle.style.transform = `rotate(${Math.random() * 45}deg)`;
        
        particle.style.boxShadow = `0 0 10px 4px rgba(255, 255, 255, ${glowIntensity})`;
      }
      else if (particleType === 'stardust') {
        particle.className = 'absolute rounded-full';
        
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.3 + 0.1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = opacity.toString();
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        
        if (Math.random() > 0.7) {
          particle.style.boxShadow = `0 0 ${Math.random() * 3 + 1}px rgba(255, 255, 255, 0.5)`;
        }
      }
      
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      const duration = Math.random() * 15 + 10;
      
      if (particleType === 'meteor') {
        particle.style.animation = `meteor ${duration}s linear infinite`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
      } else if (particleType === 'stardust') {
        particle.style.animation = `float ${duration * 2}s infinite`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
      } else {
        particle.style.animation = `pulse-subtle ${duration}s infinite, float ${duration * 1.5}s infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
      }
      
      container.appendChild(particle);
      particles.push(particle);
    }
    
    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, [active, intensity, particleType, brightness, isClient]);
  
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-10"
    />
  );
};

export default SpaceParticles;
