import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, CheckCircle2, Trophy, Rocket, Share2, Copy, Facebook, Linkedin } from 'lucide-react';
// Use a custom Twitter icon to avoid the deprecated one
import { toast } from '@/hooks/use-toast';
import { getMissions, claimMissionReward, shareMissionAchievement } from '@/utils/missionUtils';
import { Mission } from '@/types/missions';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom Twitter icon component to replace the deprecated one
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const MissionSystem = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

  // Render the appropriate action buttons based on mission state
  const renderMissionActionButtons = (mission: Mission) => {
    // Case 1: Mission is completed but not claimed yet
    if (mission.completed && !mission.claimed) {
      return (
        <Button
          size="sm"
          onClick={() => handleClaimReward(mission.id)}
          className="bg-cosmic-gold hover:bg-cosmic-gold/90 text-xs h-7 px-2"
        >
          <Award className="w-3 h-3 mr-1" />
          Claim Reward
        </Button>
      );
    }
    
    // Case 2: Mission is completed and claimed
    if (mission.claimed) {
      return (
        <>
          <span className="text-cosmic-gold/70 mr-2">Claimed</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-cosmic-gold bg-cosmic-blue/10 hover:bg-cosmic-blue/20 text-xs h-7 px-2"
              >
                <Share2 className="w-3 h-3 mr-1" />
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-cosmic-blue/90 border-cosmic-gold backdrop-blur-lg text-cosmic-white">
              <DropdownMenuItem 
                className="flex items-center cursor-pointer hover:bg-cosmic-purple/20"
                onClick={() => handleShareMission(mission, 'twitter')}
              >
                <div className="w-4 h-4 mr-2 text-[#1DA1F2]">
                  <TwitterIcon />
                </div>
                Twitter
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center cursor-pointer hover:bg-cosmic-purple/20"
                onClick={() => handleShareMission(mission, 'facebook')}
              >
                <Facebook className="w-4 h-4 mr-2 text-[#4267B2]" />
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center cursor-pointer hover:bg-cosmic-purple/20"
                onClick={() => handleShareMission(mission, 'linkedin')}
              >
                <Linkedin className="w-4 h-4 mr-2 text-[#0077B5]" />
                LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center cursor-pointer hover:bg-cosmic-purple/20"
                onClick={() => handleShareMission(mission, 'copy')}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Text
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    }
    
    // Case 3: Mission is not completed (default case)
    return null;
  };

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

  // This function is currently not used but kept for future functionality
  // If you don't plan to use it in the future, you can safely remove it
  /* 
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
  */

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

  const handleShareMission = (mission: Mission, platform: 'twitter' | 'facebook' | 'linkedin' | 'copy') => {
    shareMissionAchievement(mission, platform);
    
    if (platform === 'copy') {
      toast({
        title: "Copied to Clipboard!",
        description: "Your achievement has been copied to clipboard.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Sharing Achievement!",
        description: `Opening ${platform.charAt(0).toUpperCase() + platform.slice(1)} to share your achievement.`,
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Active Mission */}
      {activeMission && (
        <Card className="bg-cosmic-blue/20 border-cosmic-gold backdrop-blur-lg overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/5" />
          </div>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-cosmic-white text-xl">Current Mission</CardTitle>
              <Badge 
                variant="outline" 
                className="border-cosmic-gold bg-cosmic-purple/20 text-cosmic-white"
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
              <p>Reward: <span className="text-cosmic-gold">{activeMission.rewardPoints} cosmic points</span></p>
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
                className={`bg-cosmic-blue/20 border-cosmic-gold backdrop-blur-lg transition-all duration-300 ${
                  mission.completed ? 'border-cosmic-gold' : ''
                } ${mission.claimed ? 'opacity-70' : ''}`}
              >
                <CardHeader className="py-3 px-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {mission.completed && mission.claimed ? (
                        <CheckCircle2 className="w-4 h-4 text-cosmic-gold" />
                      ) : mission.completed ? (
                        <Trophy className="w-4 h-4 text-cosmic-gold animate-pulse-subtle" />
                      ) : (
                        <Rocket className="w-4 h-4 text-cosmic-white/70" />
                      )}
                      <CardTitle className="text-cosmic-white text-base">
                        {mission.title}
                      </CardTitle>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="border-cosmic-gold/20 bg-cosmic-purple/10 text-cosmic-white/70 text-xs"
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
                      
                      <div className="flex space-x-2">
                        {renderMissionActionButtons(mission)}
                      </div>
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
