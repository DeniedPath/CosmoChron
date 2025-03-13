
import { Mission } from '@/types/missions';
import { getTotalFocusMinutes } from './timerUtils';

// Default missions
const defaultMissions: Mission[] = [
  {
    id: 'daily-1',
    title: 'Daily Orbit',
    description: 'Complete one 25-minute focus session',
    type: 'daily',
    progress: 0,
    requiredProgress: 1,
    unit: 'sessions',
    completed: false,
    claimed: false,
    rewardPoints: 10,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'daily-2',
    title: 'Meteor Shower',
    description: 'Complete three focus sessions in one day',
    type: 'daily',
    progress: 0,
    requiredProgress: 3,
    unit: 'sessions',
    completed: false,
    claimed: false,
    rewardPoints: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'weekly-1',
    title: 'Planetary Alignment',
    description: 'Complete focus sessions on 5 different days this week',
    type: 'weekly',
    progress: 0,
    requiredProgress: 5,
    unit: 'days',
    completed: false,
    claimed: false,
    rewardPoints: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'achievement-1',
    title: 'Cosmic Milestone',
    description: 'Reach 60 minutes of total focus time',
    type: 'achievement',
    progress: 0,
    requiredProgress: 60,
    unit: 'minutes',
    completed: false,
    claimed: false,
    rewardPoints: 50,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'achievement-2',
    title: 'Interstellar Explorer',
    description: 'Reach 300 minutes of total focus time',
    type: 'achievement',
    progress: 0,
    requiredProgress: 300,
    unit: 'minutes',
    completed: false,
    claimed: false,
    rewardPoints: 150,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'special-1',
    title: 'First Contact',
    description: 'Try the breathing guide feature during a session',
    type: 'special',
    progress: 0,
    requiredProgress: 1,
    unit: 'times',
    completed: false,
    claimed: false,
    rewardPoints: 20,
    createdAt: new Date().toISOString(),
  }
];

/**
 * Get missions from local storage or initialize with defaults
 */
export const getMissions = (): Mission[] => {
  // Try to get missions from localStorage
  const storedMissions = localStorage.getItem('spaceMissions');
  
  if (storedMissions) {
    const missions: Mission[] = JSON.parse(storedMissions);
    
    // Update progress for achievement missions based on total focus time
    const totalFocusTime = getTotalFocusMinutes();
    
    return missions.map(mission => {
      if (mission.type === 'achievement' && mission.unit === 'minutes') {
        const updatedMission = { ...mission, progress: totalFocusTime };
        if (totalFocusTime >= mission.requiredProgress && !mission.completed) {
          updatedMission.completed = true;
        }
        return updatedMission;
      }
      return mission;
    });
  }
  
  // Initialize with default missions
  return defaultMissions;
};

/**
 * Save missions to local storage
 */
export const saveMissions = (missions: Mission[]): void => {
  localStorage.setItem('spaceMissions', JSON.stringify(missions));
};

/**
 * Update mission progress
 */
export const updateMissionProgress = (missionId: string, progress: number): Mission[] => {
  const missions = getMissions();
  
  const updatedMissions = missions.map(mission => {
    if (mission.id === missionId) {
      const updatedMission = { 
        ...mission, 
        progress: Math.min(progress, mission.requiredProgress)
      };
      
      // Check if mission is now completed
      if (updatedMission.progress >= updatedMission.requiredProgress && !updatedMission.completed) {
        updatedMission.completed = true;
        updatedMission.completedAt = new Date().toISOString();
      }
      
      return updatedMission;
    }
    return mission;
  });
  
  saveMissions(updatedMissions);
  return updatedMissions;
};

/**
 * Update daily mission progress after completing a session
 */
export const updateSessionMissions = (durationMinutes: number, completed: boolean): void => {
  if (!completed) return;
  
  const missions = getMissions();
  let updated = false;
  
  const updatedMissions = missions.map(mission => {
    const updatedMission = { ...mission };
    
    // Update daily session completion missions
    if ((mission.id === 'daily-1' || mission.id === 'daily-2') && 
        mission.type === 'daily' && 
        !mission.completed) {
      updatedMission.progress += 1;
      if (updatedMission.progress >= updatedMission.requiredProgress) {
        updatedMission.completed = true;
        updatedMission.completedAt = new Date().toISOString();
      }
      updated = true;
    }
    
    // Special mission: using breathing guide (handled separately)
    
    return updatedMission;
  });
  
  if (updated) {
    saveMissions(updatedMissions);
  }
};

/**
 * Mark breathing guide mission as complete
 */
export const completeBreathingGuideMission = (): void => {
  const missions = getMissions();
  const breathingMission = missions.find(m => m.id === 'special-1');
  
  if (breathingMission && !breathingMission.completed) {
    updateMissionProgress('special-1', 1);
  }
};

/**
 * Claim mission reward
 */
export const claimMissionReward = (missionId: string): Mission[] => {
  const missions = getMissions();
  
  const updatedMissions = missions.map(mission => {
    if (mission.id === missionId && mission.completed && !mission.claimed) {
      // Add points to user total
      const currentPoints = Number(localStorage.getItem('cosmicPoints') || '0');
      localStorage.setItem('cosmicPoints', String(currentPoints + mission.rewardPoints));
      
      // Mark as claimed
      return { ...mission, claimed: true };
    }
    return mission;
  });
  
  saveMissions(updatedMissions);
  return updatedMissions;
};

/**
 * Get user's cosmic points
 */
export const getCosmicPoints = (): number => {
  return Number(localStorage.getItem('cosmicPoints') || '0');
};

/**
 * Reset daily missions (should be called at the start of a new day)
 */
export const resetDailyMissions = (): void => {
  const missions = getMissions();
  const today = new Date().toDateString();
  const lastReset = localStorage.getItem('lastDailyReset');
  
  // Only reset if it's a new day
  if (lastReset !== today) {
    const updatedMissions = missions.map(mission => {
      if (mission.type === 'daily') {
        return {
          ...mission,
          progress: 0,
          completed: false,
          claimed: false,
          completedAt: undefined
        };
      }
      return mission;
    });
    
    saveMissions(updatedMissions);
    localStorage.setItem('lastDailyReset', today);
  }
};

/**
 * Reset weekly missions (should be called at the start of a new week)
 */
export const resetWeeklyMissions = (): void => {
  const missions = getMissions();
  const now = new Date();
  const weekNumber = `${now.getFullYear()}-${Math.floor(now.getDate() / 7)}`;
  const lastWeekReset = localStorage.getItem('lastWeeklyReset');
  
  // Only reset if it's a new week
  if (lastWeekReset !== weekNumber) {
    const updatedMissions = missions.map(mission => {
      if (mission.type === 'weekly') {
        return {
          ...mission,
          progress: 0,
          completed: false,
          claimed: false,
          completedAt: undefined
        };
      }
      return mission;
    });
    
    saveMissions(updatedMissions);
    localStorage.setItem('lastWeeklyReset', weekNumber);
  }
};
