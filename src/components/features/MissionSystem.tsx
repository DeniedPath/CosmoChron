
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, CheckCircle2, Trophy, Rocket } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getMissions, updateMissionProgress, claimMissionReward } from '@/utils/missionUtils';
import { Mission } from '@/types/missions';
import { ScrollArea } from '@/components/ui/scroll-area';

const MissionSystem = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

  useEffect(() => {
    // Load missions from storage
    const loadedMissions = getMissions();
    setMissions(loadedMissions);
    
    // Set active mission (first incomplete one)
    const active = loadedMissions.find(m => !m.completed && !m.claimed);
    if (active) {
      setActiveMission(active);
    }
  }, []);

  const handleProgressUpdate = (missionId: string, progress: number) => {
    const updatedMissions = updateMissionProgress(missionId, progress);
    setMissions(updatedMissions);
    
    // Find newly completed missions
    const completedMission = updatedMissions.find(
      m => m.id === missionId && m.progress >= m.requiredProgress && !m.claimed
    );
    
    if (completedMission) {
      toast({
        title: "Mission Complete!",
        description: `You've completed: ${completedMission.title}`,
        duration: 5000,
      });
    }
    
    // Update active mission
    const nextActive = updatedMissions.find(m => !m.completed && !m.claimed);
    setActiveMission(nextActive || null);
  };

  const handleClaimReward = (missionId: string) => {
    const updatedMissions = claimMissionReward(missionId);
    setMissions(updatedMissions);
    
    const claimedMission = updatedMissions.find(m => m.id === missionId);
    if (claimedMission) {
      toast({
        title: "Reward Claimed!",
        description: `You've received ${claimedMission.rewardPoints} cosmic points!`,
        duration: 5000,
      });
    }
    
    // Update active mission
    const nextActive = updatedMissions.find(m => !m.completed && !m.claimed);
    setActiveMission(nextActive || null);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Active Mission */}
      {activeMission && (
        <Card className="bg-cosmic-blue/20 border-cosmic-highlight/30 backdrop-blur-lg overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/5" />
          </div>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-cosmic-white text-xl">Current Mission</CardTitle>
              <Badge 
                variant="outline" 
                className="border-cosmic-highlight bg-cosmic-purple/20 text-cosmic-white"
              >
                {activeMission.type}
              </Badge>
            </div>
            <CardDescription className="text-cosmic-white/70">
              {activeMission.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-cosmic-white/80 mb-4">{activeMission.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cosmic-white/70">Progress</span>
                <span className="text-cosmic-white">
                  {activeMission.progress} / {activeMission.requiredProgress} {activeMission.unit}
                </span>
              </div>
              <Progress 
                value={(activeMission.progress / activeMission.requiredProgress) * 100} 
                className="h-2 bg-cosmic-blue/30" 
              />
            </div>
            <div className="mt-4 text-sm text-cosmic-white/70">
              <p>Reward: <span className="text-cosmic-highlight">{activeMission.rewardPoints} cosmic points</span></p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mission List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-cosmic-white">All Missions</h3>
        
        <ScrollArea className="h-[400px] rounded-md pr-4">
          <div className="space-y-4">
            {missions.map(mission => (
              <Card 
                key={mission.id}
                className={`bg-cosmic-blue/20 border-cosmic-highlight/30 backdrop-blur-lg transition-all duration-300 ${
                  mission.completed ? 'border-cosmic-highlight/50' : ''
                } ${mission.claimed ? 'opacity-70' : ''}`}
              >
                <CardHeader className="py-3 px-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {mission.completed && mission.claimed ? (
                        <CheckCircle2 className="w-4 h-4 text-cosmic-highlight" />
                      ) : mission.completed ? (
                        <Trophy className="w-4 h-4 text-cosmic-highlight animate-pulse-subtle" />
                      ) : (
                        <Rocket className="w-4 h-4 text-cosmic-white/70" />
                      )}
                      <CardTitle className="text-cosmic-white text-base">
                        {mission.title}
                      </CardTitle>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="border-cosmic-highlight/20 bg-cosmic-purple/10 text-cosmic-white/70 text-xs"
                    >
                      {mission.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="space-y-2">
                    <Progress 
                      value={(mission.progress / mission.requiredProgress) * 100} 
                      className="h-1.5 bg-cosmic-blue/20" 
                    />
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-cosmic-white/60">
                        {mission.progress} / {mission.requiredProgress} {mission.unit}
                      </span>
                      
                      {mission.completed && !mission.claimed ? (
                        <Button
                          size="sm"
                          onClick={() => handleClaimReward(mission.id)}
                          className="bg-cosmic-highlight hover:bg-cosmic-highlight/90 text-xs h-7 px-2"
                        >
                          <Award className="w-3 h-3 mr-1" />
                          Claim Reward
                        </Button>
                      ) : mission.claimed ? (
                        <span className="text-cosmic-highlight/70">Claimed</span>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MissionSystem;
