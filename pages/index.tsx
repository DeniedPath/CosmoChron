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

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [cosmicPoints, setCosmicPoints] = useState(0);
  const { getWeatherConditionClass } = useWeather();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);
    
    setCosmicPoints(getCosmicPoints());
    
    // Force reflow of the space background elements
    document.body.classList.add('bg-cosmic-dark');
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('bg-cosmic-dark');
    };
  }, []);
  
  const weatherClass = getWeatherConditionClass();
  const totalFocusMinutes = getTotalFocusMinutes();
  const { level } = getRank(totalFocusMinutes);
  const { progressPercent } = getNextRankProgress(totalFocusMinutes);
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      <SpaceBackground 
        weatherCondition={weatherClass} 
        enhancedStars={true}
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
}
