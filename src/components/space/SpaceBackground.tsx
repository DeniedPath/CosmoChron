import React, { ReactNode, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SpaceParticles from './SpaceParticles';
import CosmicElements from './CosmicElements';
import WeatherEffects from '../weather/WeatherEffects';
import WeatherBackgroundStyle from '../weather/WeatherBackgroundStyle';
import PlanetarySystem from './PlanetarySystem';
import ShootingStars from './ShootingStars';

// Import StarField component with client-side only rendering
const StarField = dynamic(() => import('./StarField'), { ssr: false });

interface SpaceBackgroundProps {
  children: ReactNode;
  weatherCondition?: string;
  enhancedStars?: boolean;
}

const SpaceBackground: React.FC<SpaceBackgroundProps> = ({ 
  children,
  weatherCondition = 'weather-clear',
  enhancedStars = true
}) => {
  const [mounted, setMounted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    setIsMounted(true);
    
    // Force repaint of background elements
    const timer = setTimeout(() => {
      document.body.classList.add('bg-loaded');
    }, 100);
    
    return () => {
      setMounted(false);
      setIsMounted(false);
      clearTimeout(timer);
      document.body.classList.remove('bg-loaded');
    };
  }, []);
  
  return (
    <div className="relative min-h-screen bg-cosmic-dark text-cosmic-white">
      {/* Animated Background */}
      <WeatherBackgroundStyle weatherCondition={weatherCondition}>
        {/* Star field components with increased opacity */}
        {isMounted && <StarField />}
        
        {/* Add space particles for stars and cosmic effects with extremely high intensity */}
        <SpaceParticles active={true} intensity={enhancedStars ? "high" : "medium"} particleType="stars" />
        <SpaceParticles active={true} intensity="medium" particleType="cosmic" />
        <SpaceParticles active={true} intensity="low" particleType="meteor" />
        
        {/* Add subtle star dust particles in the background */}
        <SpaceParticles active={true} intensity="high" particleType="stardust" />
        
        {/* Add shooting stars effect */}
        <ShootingStars />
        
        {/* Add planetary systems */}
        <PlanetarySystem position={{ top: '15%', right: '5%' }} scale={0.8} />
        <PlanetarySystem position={{ bottom: '20%', left: '10%' }} scale={0.5} />
        
        {/* Weather-specific effects */}
        <WeatherEffects weatherCondition={weatherCondition} />
        
        {/* Cosmic elements like planets and nebulae with increased visibility */}
        <CosmicElements />
      </WeatherBackgroundStyle>
      
      {/* Content */}
      <div className={`relative z-20 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default SpaceBackground;
