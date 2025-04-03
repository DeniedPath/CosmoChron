import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, Star, Award, Shield } from 'lucide-react';

interface SpaceStationProps {
  totalMinutes?: number;
  currentLevel?: number;
  progressPercent?: number;
}

const SpaceStation: React.FC<SpaceStationProps> = ({ 
  totalMinutes = 0,
  currentLevel = 0, 
  progressPercent = 0
}) => {
  // Space station modules based on progress/level
  const modules = [
    { name: 'Core Module', threshold: 0, icon: <Rocket className="h-8 w-8 text-cosmic-gold" /> },
    { name: 'Research Lab', threshold: 120, icon: <Star className="h-8 w-8 text-yellow-400" /> },
    { name: 'Observatory', threshold: 300, icon: <Award className="h-8 w-8 text-cyan-400" /> },
    { name: 'Defense Shield', threshold: 600, icon: <Shield className="h-8 w-8 text-purple-400" /> },
  ];
  
  // Determine which modules are unlocked
  // const unlockedModules = modules.filter(module => totalMinutes >= module.threshold);
  
  return (
    <div className="w-full space-y-6 animate-fade-in">
      <Card className="cosmic-blur overflow-hidden relative border border-cosmic-gold">
        <CardContent className="p-6">
          <div className="relative z-10">
            <h3 className="text-cosmic-gold text-xl font-semibold mb-2">Your Space Station</h3>
            <p className="text-cosmic-white/70 mb-6 text-sm">
              Expand your cosmic base by focusing more
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {modules.map((module, index) => {
                const isUnlocked = totalMinutes >= module.threshold;
                return (
                  <div 
                    key={index}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-3 border transition-all duration-300 ${
                      isUnlocked 
                        ? 'bg-cosmic-blue/30 border-cosmic-gold' 
                        : 'bg-cosmic-blue/10 border-cosmic-gold/10 opacity-50'
                    }`}
                  >
                    <div className={`mb-2 transition-transform duration-300 ${isUnlocked ? 'scale-100' : 'scale-75'}`}>
                      {module.icon}
                    </div>
                    <span className="text-sm text-cosmic-white/90 text-center font-medium">
                      {module.name}
                    </span>
                    <div className="absolute -bottom-1 left-0 w-full flex justify-center">
                      {!isUnlocked && (
                        <span className="text-xs text-cosmic-white/60 bg-cosmic-blue/50 rounded-full px-2 py-0.5">
                          {module.threshold - totalMinutes > 0 
                            ? `${module.threshold - totalMinutes}m left` 
                            : 'Unlocked!'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cosmic-white/70">Station Progress</span>
                <span className="text-cosmic-white">Level {currentLevel}</span>
              </div>
              <Progress value={progressPercent} className="h-2 bg-cosmic-blue/30" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpaceStation;
