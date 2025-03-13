import React from 'react';
import SpaceBackground from '@/components/space/SpaceBackground';
import SpaceStation from '@/components/features/SpaceStation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Timer, Rocket } from 'lucide-react';
import Link from 'next/link';
import { getTotalFocusMinutes, getRank, getNextRankProgress } from '@/utils/timerUtils';

const SpaceStationPage = () => {
  const totalFocusMinutes = getTotalFocusMinutes();
  const { level } = getRank(totalFocusMinutes);
  const { progressPercent } = getNextRankProgress(totalFocusMinutes);
  
  return (
    <SpaceBackground>
      <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 bg-cosmic-blue/20 hover:bg-cosmic-blue/30">
                <ChevronLeft className="h-5 w-5 text-cosmic-white" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold cosmic-highlight">Space Station</h1>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="space-y-8">
          <SpaceStation 
            totalMinutes={totalFocusMinutes}
            currentLevel={level}
            progressPercent={progressPercent}
          />
          
          <div className="w-full max-w-lg mx-auto">
            <div className="cosmic-blur p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-cosmic-white mb-4">Station Expansion</h3>
              <p className="text-cosmic-white/80 mb-6">
                Your cosmic achievements are reflected in your space station. 
                Continue focusing to expand your station with more modules!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/">
                  <Button className="w-full bg-cosmic-purple/60 hover:bg-cosmic-purple/80">
                    <Timer className="mr-2 h-4 w-4" />
                    Start Focusing
                  </Button>
                </Link>
                <Link href="/missions">
                  <Button variant="outline" className="w-full border-cosmic-highlight/40 text-cosmic-white bg-cosmic-blue/20 hover:bg-cosmic-blue/40">
                    <Rocket className="mr-2 h-4 w-4" />
                    View Missions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SpaceBackground>
  );
};

export default SpaceStationPage;
