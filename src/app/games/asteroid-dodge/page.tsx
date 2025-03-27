"use client";

import React, { useState, useEffect } from 'react';
import SpaceBackground from '@/components/space/SpaceBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWeather } from '@/hooks/useWeather';
import { getCosmicPoints } from '@/utils/missionUtils';
import AsteroidDodgeGame from '@/components/games/AsteroidDodgeGame';
import { BackButton } from '@/components/ui/back-button';

export default function AsteroidDodgePage() {
  const [cosmicPoints, setCosmicPoints] = useState(0);
  const [weatherClass, setWeatherClass] = useState('weather-clear');
  const [enhancedStars] = useState(true);
  const [shootingStarBrightness, setShootingStarBrightness] = useState(0.75);
  
  const { getWeatherConditionClass } = useWeather({
    autoFetch: true
  });
  
  useEffect(() => {
    try {
      const currentWeatherClass = getWeatherConditionClass();
      if (currentWeatherClass) {
        setWeatherClass(currentWeatherClass);
      }
    } catch (e) {
      console.error("Error getting weather class:", e);
    }
    
    try {
      setCosmicPoints(getCosmicPoints());
    } catch (e) {
      console.error("Error getting cosmic points:", e);
      setCosmicPoints(0);
    }
    
    try {
      const savedBrightness = localStorage.getItem('shootingStarBrightness');
      if (savedBrightness) {
        setShootingStarBrightness(parseInt(savedBrightness) / 100);
      }
    } catch (e) {
      console.error("Error loading brightness setting:", e);
    }
  }, [getWeatherConditionClass]);
  
  return (
    <div className="h-screen w-screen overflow-auto">
      <SpaceBackground 
        weatherCondition={weatherClass} 
        enhancedStars={enhancedStars}
        shootingStarBrightness={shootingStarBrightness}
      >
        <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto relative z-10">
          <Header cosmicPoints={cosmicPoints} />
          
          <main className="space-y-8 pb-20">
            <BackButton />
            <AsteroidDodgeGame />
          </main>
          
          <Footer />
        </div>
      </SpaceBackground>
    </div>
  );
}
