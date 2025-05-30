// src/components/SpaceBackground.tsx

"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import SpaceParticles from './SpaceParticles';
import StarField from './StarField';
import CosmicElements from './CosmicElements';
import WeatherEffects from '../weather/WeatherEffects';
import WeatherBackgroundStyle from '../weather/WeatherBackgroundStyle';
import PlanetarySystem from './PlanetarySystem';
import ShootingStars from './ShootingStars';

interface SpaceBackgroundProps {
  children: ReactNode;
  weatherCondition?: string;
  enhancedStars?: boolean;
  shootingStarBrightness?: number;
}

const SpaceBackground: React.FC<SpaceBackgroundProps> = ({ 
  children,
  weatherCondition = 'weather-clear', // Default value ensures it always has a valid value
  enhancedStars = true,
  shootingStarBrightness = 0.75 // Default value
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Force repaint of background elements
    const timer = setTimeout(() => {
      try {
        document.body.classList.add('bg-loaded');
      } catch (e) {
        console.error("Error adding bg-loaded class:", e);
      }
    }, 100);
    
    return () => {
      setMounted(false);
      clearTimeout(timer);
      try {
        document.body.classList.remove('bg-loaded');
      } catch (e) {
        console.error("Error removing bg-loaded class:", e);
      }
    };
  }, []);
  
  return (
    <div className="relative min-h-screen w-full bg-cosmic-dark text-cosmic-white">
      {/* Fixed position background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Background */}
        <WeatherBackgroundStyle weatherCondition={weatherCondition}>
          {/* Star field components with increased opacity */}
          <StarField />
          
           {/* Add space particles for stars and cosmic effects with extremely high intensity */}
        <SpaceParticles active={true} intensity={enhancedStars ? "high" : "medium"} particleType="stars" />
        <SpaceParticles active={true} intensity="medium" particleType="cosmic" />
        
        {/* Add subtle star dust particles in the background */}
        <SpaceParticles active={true} intensity="high" particleType="stardust" />
          
           {/* Add shooting stars effect with adjustable brightness */}
        <ShootingStars brightness={shootingStarBrightness} />
          
          {/* Add planetary systems */}
          <PlanetarySystem position={{ top: '15%', right: '5%' }} scale={0.8} />
          <PlanetarySystem position={{ bottom: '20%', left: '10%' }} scale={0.5} />
          
          {/* Weather-specific effects */}
          <WeatherEffects weatherCondition={weatherCondition} />
          
          {/* Cosmic elements like planets and nebulae with increased visibility */}
          <CosmicElements />
        </WeatherBackgroundStyle>
      </div>
      
      {/* Content */}
      <div className={`relative z-20 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default SpaceBackground;