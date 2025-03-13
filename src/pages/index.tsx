// src/pages/Index.tsx

import React, { useState, useEffect } from 'react';
import SpaceBackground from '@/components/space/SpaceBackground';
import { Tabs } from '@/components/ui/tabs';
import { getCosmicPoints } from '@/utils/missionUtils';
import { useWeather } from '@/hooks/useWeather';
import { getTotalFocusMinutes, getRank, getNextRankProgress } from '@/utils/timerUtils';


// Import the components
import Header from '@/components/Header';
import TabsNavigation from '@/components/tabs/TabsNavigation';
import TabContent from '@/components/tabs/TabContent';
import Footer from '@/components/Footer';
import IntroAnimation from '@/components/IntroAnimation';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [cosmicPoints, setCosmicPoints] = useState(0);
  const [enhancedStars, setEnhancedStars] = useState(true);
  
  // Use a more stable default value for weather class
  const [weatherClass, setWeatherClass] = useState('weather-clear');
  
  // Initialize the weather hook with proper error handling
  const { getWeatherConditionClass, error: weatherError } = useWeather({
    autoFetch: true
  });
  
  // Update weather class when condition changes
  useEffect(() => {
    try {
      // Update weather class safely
      const currentWeatherClass = getWeatherConditionClass();
      if (currentWeatherClass) {
        setWeatherClass(currentWeatherClass);
      }
    } catch (e) {
      console.error("Error getting weather class:", e);
      // Keep default weather if there's an error
    }
  }, [getWeatherConditionClass]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);
    
    try {
      setCosmicPoints(getCosmicPoints());
    } catch (e) {
      console.error("Error getting cosmic points:", e);
      setCosmicPoints(0);
    }
    
    // Force repaint of space background elements
    document.body.classList.add('bg-cosmic-dark');
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('bg-cosmic-dark');
    };
  }, []);

  // Safely get focus minutes and rank data
  let totalFocusMinutes = 0;
  let level = 1;
  let progressPercent = 0;
  
  try {
    totalFocusMinutes = getTotalFocusMinutes();
    const rankInfo = getRank(totalFocusMinutes);
    level = rankInfo.level;
    const progressInfo = getNextRankProgress(totalFocusMinutes);
    progressPercent = progressInfo.progressPercent;
  } catch (e) {
    console.error("Error getting focus data:", e);
  }
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      <SpaceBackground 
        weatherCondition={weatherClass} 
        enhancedStars={enhancedStars}
      >
        <IntroAnimation show={showIntro} />
        
        <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto relative z-10">
          <Header cosmicPoints={cosmicPoints} />
          
          <main className="space-y-8">
            <Tabs defaultValue="timer" className="w-full">
              <TabsNavigation />
              <TabContent 
                totalFocusMinutes={totalFocusMinutes}
                level={level}
                progressPercent={progressPercent}
              />
            </Tabs>
          </main>
          
          <Footer />
        </div>
      </SpaceBackground>
    </div>
  );
};

export default Index;