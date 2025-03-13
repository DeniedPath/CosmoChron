/**
 * Converts seconds to a formatted time string (MM:SS)
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Parses a time string (MM:SS) to total seconds
 */
export const parseTimeToSeconds = (timeString: string): number => {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return (minutes * 60) + seconds;
};

/**
 * Calculates the progress percentage
 */
export const calculateProgress = (currentTime: number, totalTime: number): number => {
  if (totalTime <= 0) return 0;
  return ((totalTime - currentTime) / totalTime) * 100;
};

/**
 * Gets the rank based on total focus time (in minutes)
 */
export const getRank = (totalFocusMinutes: number): { title: string; level: number } => {
  const ranks = [
    { title: 'Cosmic Novice', level: 1, minutes: 0 },
    { title: 'Stellar Explorer', level: 2, minutes: 60 },
    { title: 'Orbit Keeper', level: 3, minutes: 300 },
    { title: 'Nebula Navigator', level: 4, minutes: 600 },
    { title: 'Galaxy Guardian', level: 5, minutes: 1200 },
    { title: 'Supernova Sentinel', level: 6, minutes: 2400 },
    { title: 'Celestial Sovereign', level: 7, minutes: 4800 }
  ];
  
  // Find the highest rank the user has achieved
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (totalFocusMinutes >= ranks[i].minutes) {
      return {
        title: ranks[i].title,
        level: ranks[i].level
      };
    }
  }
  
  // Default to the first rank
  return {
    title: ranks[0].title,
    level: ranks[0].level
  };
};

/**
 * Calculates minutes remaining until next rank
 */
export const getNextRankProgress = (totalFocusMinutes: number): { nextRank: string; minutesRemaining: number; progressPercent: number } => {
  const ranks = [
    { title: 'Cosmic Novice', level: 1, minutes: 0 },
    { title: 'Stellar Explorer', level: 2, minutes: 60 },
    { title: 'Orbit Keeper', level: 3, minutes: 300 },
    { title: 'Nebula Navigator', level: 4, minutes: 600 },
    { title: 'Galaxy Guardian', level: 5, minutes: 1200 },
    { title: 'Supernova Sentinel', level: 6, minutes: 2400 },
    { title: 'Celestial Sovereign', level: 7, minutes: 4800 }
  ];
  
  // Find the next rank to achieve
  for (let i = 0; i < ranks.length - 1; i++) {
    if (totalFocusMinutes >= ranks[i].minutes && totalFocusMinutes < ranks[i + 1].minutes) {
      const currentMin = ranks[i].minutes;
      const nextMin = ranks[i + 1].minutes;
      const minutesRemaining = nextMin - totalFocusMinutes;
      const progress = (totalFocusMinutes - currentMin) / (nextMin - currentMin) * 100;
      
      return {
        nextRank: ranks[i + 1].title,
        minutesRemaining,
        progressPercent: progress
      };
    }
  }
  
  // If user has achieved the max rank
  if (totalFocusMinutes >= ranks[ranks.length - 1].minutes) {
    return {
      nextRank: 'Max Rank Achieved',
      minutesRemaining: 0,
      progressPercent: 100
    };
  }
  
  // Default for new users
  return {
    nextRank: ranks[1].title,
    minutesRemaining: ranks[1].minutes,
    progressPercent: (totalFocusMinutes / ranks[1].minutes) * 100
  };
};

/**
 * Gets a random space fact
 */
export const getRandomSpaceFact = (): string => {
  const facts = [
    "A year on Mercury is just 88 days long.",
    "Venus is the hottest planet in our solar system.",
    "The Sun makes up 99.86% of the mass in the solar system.",
    "One million Earths could fit inside the Sun.",
    "A day on Venus is longer than a year on Venus.",
    "The Great Red Spot on Jupiter is shrinking.",
    "Saturn's rings are made mostly of ice and rock.",
    "Uranus rotates on its side, unlike other planets.",
    "Neptune has the strongest winds in the solar system.",
    "If you could fly a plane to Pluto, it would take over 800 years."
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
};

/**
 * Saves completed focus session to local storage
 */
export const saveSession = (durationMinutes: number, completed: boolean): void => {
  if (typeof window === 'undefined') return;
  const timestamp = new Date().toISOString();
  const session = { timestamp, durationMinutes, completed };
  
  // Get existing sessions
  const existingSessions = JSON.parse(localStorage.getItem('focusSessions') ?? '[]');
  existingSessions.push(session);
  
  // Save updated sessions
  localStorage.setItem('focusSessions', JSON.stringify(existingSessions));
  
  // Update total focus minutes if session was completed
  if (completed) {
    const currentTotal = Number(localStorage.getItem('totalFocusMinutes') ?? '0');
    localStorage.setItem('totalFocusMinutes', String(currentTotal + durationMinutes));
  }
};

/**
 * Gets sessions from local storage
 */
export const getSessions = (): { timestamp: string; durationMinutes: number; completed: boolean }[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('focusSessions') ?? '[]');
};

/**
 * Gets total focus minutes from local storage
 */
export const getTotalFocusMinutes = (): number => {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem('totalFocusMinutes') ?? '0');
};
