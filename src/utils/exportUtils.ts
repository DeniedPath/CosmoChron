/**
 * Utility functions for exporting data
 */

interface Session {
  timestamp: string;
  durationMinutes: number;
  completed: boolean;
}

/**
 * Converts session data to CSV format
 * @param sessions Array of session data
 * @returns CSV string
 */
export const convertToCSV = (sessions: Session[]): string => {
  // Define CSV headers
  const headers = ['Date', 'Time', 'Duration (minutes)', 'Completed'];
  
  // Map sessions to CSV rows
  const rows = sessions.map(session => {
    const date = new Date(session.timestamp);
    return [
      date.toLocaleDateString(),
      date.toLocaleTimeString(),
      session.durationMinutes.toString(),
      session.completed ? 'Yes' : 'No'
    ];
  });
  
  // Combine headers and rows
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
};

/**
 * Converts session data to JSON format
 * @param sessions Array of session data
 * @returns JSON string
 */
export const convertToJSON = (sessions: Session[]): string => {
  return JSON.stringify(sessions, null, 2);
};

/**
 * Generates analytics summary data in JSON format
 * @param sessions Array of session data
 * @returns JSON string with analytics summary
 */
export const generateAnalyticsSummary = (sessions: Session[]): string => {
  // Calculate analytics
  const completedSessions = sessions.filter(s => s.completed);
  const totalSessions = completedSessions.length;
  const totalMinutes = completedSessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const averageMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
  const longestSession = sessions.reduce((max, session) => 
    session.completed && session.durationMinutes > max ? session.durationMinutes : max, 0);
  
  // Group by day of week
  const dayOfWeekData: Record<string, number> = {
    'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 
    'Thursday': 0, 'Friday': 0, 'Saturday': 0
  };
  
  completedSessions.forEach(session => {
    const date = new Date(session.timestamp);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    dayOfWeekData[day] += session.durationMinutes;
  });
  
  // Time of day distribution
  const timeDistribution: Record<string, number> = {
    "Morning (5-12)": 0,
    "Afternoon (12-17)": 0,
    "Evening (17-22)": 0,
    "Night (22-5)": 0
  };
  
  completedSessions.forEach(session => {
    const date = new Date(session.timestamp);
    const hour = date.getHours();
    
    if (hour >= 5 && hour < 12) timeDistribution["Morning (5-12)"] += session.durationMinutes;
    else if (hour >= 12 && hour < 17) timeDistribution["Afternoon (12-17)"] += session.durationMinutes;
    else if (hour >= 17 && hour < 22) timeDistribution["Evening (17-22)"] += session.durationMinutes;
    else timeDistribution["Night (22-5)"] += session.durationMinutes;
  });
  
  // Create summary object
  const summary = {
    exportDate: new Date().toISOString(),
    stats: {
      totalSessions,
      totalMinutes,
      totalHours: (totalMinutes / 60).toFixed(1),
      averageMinutes,
      longestSession,
      completionRate: sessions.length > 0 
        ? Math.round((completedSessions.length / sessions.length) * 100)
        : 0
    },
    distributions: {
      dayOfWeek: dayOfWeekData,
      timeOfDay: timeDistribution
    },
    rawData: {
      completedSessions: completedSessions.length,
      allSessions: sessions.length
    }
  };
  
  return JSON.stringify(summary, null, 2);
};

/**
 * Exports data as a downloadable file
 * @param data The data to export
 * @param filename The name of the file
 * @param type The MIME type of the file
 */
export const downloadFile = (data: string, filename: string, type: string): void => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
