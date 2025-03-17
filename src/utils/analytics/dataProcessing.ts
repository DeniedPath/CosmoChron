/**
 * Advanced data processing utilities for analytics
 */
import { getSessions } from '../timerUtils';

/**
 * Get sessions filtered by date range
 */
export const getSessionsByDateRange = (range: { startDate: Date; endDate: Date }): { timestamp: string; durationMinutes: number; completed: boolean }[] => {
  const sessions = getSessions();
  return sessions.filter(session => {
    const sessionDate = new Date(session.timestamp);
    return sessionDate >= range.startDate && sessionDate <= range.endDate;
  });
};

/**
 * Get predefined date ranges for analytics
 */
export const getDateRanges = (): { [key: string]: { startDate: Date; endDate: Date } } => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
  
  const endOfLastWeek = new Date(startOfWeek);
  endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);
  endOfLastWeek.setHours(23, 59, 59, 999);
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  startOfLastMonth.setHours(0, 0, 0, 0);
  
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  endOfLastMonth.setHours(23, 59, 59, 999);
  
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);
  
  const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
  startOfLastYear.setHours(0, 0, 0, 0);
  
  const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
  endOfLastYear.setHours(23, 59, 59, 999);

  return {
    today: {
      startDate: new Date(today.setHours(0, 0, 0, 0)),
      endDate: new Date(today.setHours(23, 59, 59, 999))
    },
    yesterday: {
      startDate: yesterday,
      endDate: new Date(yesterday.getTime()).setHours(23, 59, 59, 999) as unknown as Date
    },
    thisWeek: {
      startDate: startOfWeek,
      endDate: today
    },
    lastWeek: {
      startDate: startOfLastWeek,
      endDate: endOfLastWeek
    },
    thisMonth: {
      startDate: startOfMonth,
      endDate: today
    },
    lastMonth: {
      startDate: startOfLastMonth,
      endDate: endOfLastMonth
    },
    thisYear: {
      startDate: startOfYear,
      endDate: today
    },
    lastYear: {
      startDate: startOfLastYear,
      endDate: endOfLastYear
    },
    allTime: {
      startDate: new Date(0),
      endDate: today
    }
  };
};

/**
 * Create a custom date range
 */
export const createCustomDateRange = (startDate: Date, endDate: Date): { startDate: Date; endDate: Date } => {
  return {
    startDate: new Date(startDate.setHours(0, 0, 0, 0)),
    endDate: new Date(endDate.setHours(23, 59, 59, 999))
  };
};

/**
 * Get daily focus data for a date range
 */
export const getDailyFocusData = (range: { startDate: Date; endDate: Date }) => {
  const sessions = getSessionsByDateRange(range);
  const dailyData: { [key: string]: number } = {};
  
  // Initialize all days in the range
  let currentDate = new Date(range.startDate);
  while (currentDate <= range.endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    dailyData[dateStr] = 0;
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    currentDate = nextDate;
  }
  
  // Sum up minutes by day
  sessions.forEach(session => {
    if (session.completed) {
      const dateStr = new Date(session.timestamp).toISOString().split('T')[0];
      dailyData[dateStr] = (dailyData[dateStr] || 0) + session.durationMinutes;
    }
  });
  
  return Object.entries(dailyData).map(([date, minutes]) => ({
    date,
    minutes,
    formattedDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));
};

/**
 * Get weekly focus data for a date range
 */
export const getWeeklyFocusData = (range: { startDate: Date; endDate: Date }) => {
  const sessions = getSessionsByDateRange(range);
  const weeklyData: { [key: string]: number } = {};
  
  sessions.forEach(session => {
    if (session.completed) {
      const date = new Date(session.timestamp);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];
      
      weeklyData[weekKey] = (weeklyData[weekKey] || 0) + session.durationMinutes;
    }
  });
  
  return Object.entries(weeklyData).map(([weekStart, minutes]) => {
    const startDate = new Date(weekStart);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return {
      weekStart,
      minutes,
      label: `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    };
  }).sort((a, b) => new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime());
};

/**
 * Get monthly focus data for a date range
 */
export const getMonthlyFocusData = (range: { startDate: Date; endDate: Date }) => {
  const sessions = getSessionsByDateRange(range);
  const monthlyData: { [key: string]: number } = {};
  
  sessions.forEach(session => {
    if (session.completed) {
      const date = new Date(session.timestamp);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + session.durationMinutes;
    }
  });
  
  return Object.entries(monthlyData).map(([monthKey, minutes]) => {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    
    return {
      monthKey,
      minutes,
      label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
  }).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
};

/**
 * Get yearly focus data for a date range
 */
export const getYearlyFocusData = (range: { startDate: Date; endDate: Date }) => {
  const sessions = getSessionsByDateRange(range);
  const yearlyData: { [key: string]: number } = {};
  
  sessions.forEach(session => {
    if (session.completed) {
      const date = new Date(session.timestamp);
      const yearKey = date.getFullYear().toString();
      
      yearlyData[yearKey] = (yearlyData[yearKey] || 0) + session.durationMinutes;
    }
  });
  
  return Object.entries(yearlyData).map(([year, minutes]) => ({
    year,
    minutes,
    label: year
  })).sort((a, b) => a.year.localeCompare(b.year));
};

/**
 * Get year-over-year comparison data (monthly breakdown for each year)
 */
export const getYearlyComparisonData = (range: { startDate: Date; endDate: Date }) => {
  const sessions = getSessionsByDateRange(range);
  const yearMonthData: { [key: string]: { [month: string]: number } } = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize the data structure
  sessions.forEach(session => {
    if (session.completed) {
      const date = new Date(session.timestamp);
      const year = date.getFullYear().toString();
      const month = date.getMonth();
      
      if (!yearMonthData[year]) {
        yearMonthData[year] = {};
        monthNames.forEach((_, idx) => {
          yearMonthData[year][idx] = 0;
        });
      }
      
      yearMonthData[year][month] = (yearMonthData[year][month] || 0) + session.durationMinutes;
    }
  });
  
  // Transform into the format needed for the chart
  const comparisonData = monthNames.map((monthName, monthIndex) => {
    const dataPoint: Record<string, string | number> = { month: monthName };
    
    Object.keys(yearMonthData).forEach(year => {
      dataPoint[year] = yearMonthData[year][monthIndex] || 0;
    });
    
    return dataPoint;
  });
  
  return comparisonData;
};

/**
 * Calculate productivity score based on session data
 */
export const calculateProductivityScore = (range: { startDate: Date; endDate: Date }): { score: number; level: string; description: string } => {
  const sessions = getSessionsByDateRange(range);
  
  if (sessions.length === 0) {
    return {
      score: 0,
      level: 'Inactive',
      description: 'No focus sessions recorded in this period.'
    };
  }
  
  // Factors for scoring
  const totalMinutes = sessions.reduce((sum, session) => 
    session.completed ? sum + session.durationMinutes : sum, 0);
  
  const completionRate = sessions.filter(s => s.completed).length / sessions.length;
  
  const daysInRange = Math.ceil((range.endDate.getTime() - range.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysActive = new Set(sessions.map(s => new Date(s.timestamp).toISOString().split('T')[0])).size;
  const consistencyRate = daysActive / daysInRange;
  
  // Calculate average session length
  const avgSessionLength = totalMinutes / sessions.filter(s => s.completed).length;
  
  // Calculate score (0-100)
  let score = 0;
  score += Math.min(totalMinutes / 60, 10) * 3; // Up to 30 points for total time (capped at 10 hours)
  score += completionRate * 25; // Up to 25 points for completion rate
  score += consistencyRate * 25; // Up to 25 points for consistency
  score += Math.min(avgSessionLength / 60, 1) * 20; // Up to 20 points for session length (optimal around 1 hour)
  
  // Determine level
  let level = '';
  let description = '';
  
  if (score >= 90) {
    level = 'Cosmic Master';
    description = 'Exceptional focus and productivity. You\'re in the zone!';
  } else if (score >= 75) {
    level = 'Stellar Performer';
    description = 'Great productivity with consistent focus sessions.';
  } else if (score >= 60) {
    level = 'Orbit Achiever';
    description = 'Good focus habits forming. Keep up the momentum!';
  } else if (score >= 40) {
    level = 'Cosmic Apprentice';
    description = 'Building focus skills with room to grow.';
  } else if (score >= 20) {
    level = 'Space Cadet';
    description = 'Just starting your productivity journey.';
  } else {
    level = 'Cosmic Novice';
    description = 'Begin your focus journey to improve your score.';
  }
  
  return {
    score: Math.round(score),
    level,
    description
  };
};

/**
 * Identify optimal focus times based on historical data
 */
export const getOptimalFocusTimes = (range: { startDate: Date; endDate: Date }) => {
  const sessions = getSessionsByDateRange(range);
  const completedSessions = sessions.filter(s => s.completed);
  
  if (completedSessions.length === 0) {
    return {
      optimalDayOfWeek: null,
      optimalTimeOfDay: null,
      recommendation: 'Complete more focus sessions to receive personalized recommendations.'
    };
  }
  
  // Analyze by day of week
  const dayStats: { [key: string]: { count: number; totalMinutes: number } } = {
    'Sunday': { count: 0, totalMinutes: 0 },
    'Monday': { count: 0, totalMinutes: 0 },
    'Tuesday': { count: 0, totalMinutes: 0 },
    'Wednesday': { count: 0, totalMinutes: 0 },
    'Thursday': { count: 0, totalMinutes: 0 },
    'Friday': { count: 0, totalMinutes: 0 },
    'Saturday': { count: 0, totalMinutes: 0 }
  };
  
  // Analyze by time of day
  const timeStats: { [key: string]: { count: number; totalMinutes: number } } = {
    'Morning (5-12)': { count: 0, totalMinutes: 0 },
    'Afternoon (12-17)': { count: 0, totalMinutes: 0 },
    'Evening (17-22)': { count: 0, totalMinutes: 0 },
    'Night (22-5)': { count: 0, totalMinutes: 0 }
  };
  
  completedSessions.forEach(session => {
    const date = new Date(session.timestamp);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const hour = date.getHours();
    
    // Update day stats
    dayStats[dayOfWeek].count++;
    dayStats[dayOfWeek].totalMinutes += session.durationMinutes;
    
    // Update time stats
    let timeOfDay = '';
    if (hour >= 5 && hour < 12) timeOfDay = 'Morning (5-12)';
    else if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon (12-17)';
    else if (hour >= 17 && hour < 22) timeOfDay = 'Evening (17-22)';
    else timeOfDay = 'Night (22-5)';
    
    timeStats[timeOfDay].count++;
    timeStats[timeOfDay].totalMinutes += session.durationMinutes;
  });
  
  // Find optimal day
  let optimalDay = Object.entries(dayStats)
    .map(([day, stats]) => ({
      day,
      avgMinutes: stats.count > 0 ? stats.totalMinutes / stats.count : 0,
      count: stats.count
    }))
    .sort((a, b) => b.avgMinutes - a.avgMinutes)[0];
  
  // Find optimal time
  let optimalTime = Object.entries(timeStats)
    .map(([time, stats]) => ({
      time,
      avgMinutes: stats.count > 0 ? stats.totalMinutes / stats.count : 0,
      count: stats.count
    }))
    .sort((a, b) => b.avgMinutes - a.avgMinutes)[0];
  
  // Generate recommendation
  const recommendation = optimalDay.count > 0 && optimalTime.count > 0
    ? `Your most productive sessions tend to be on ${optimalDay.day}s during the ${optimalTime.time.split(' ')[0].toLowerCase()}. Consider scheduling important focus work during these times for optimal results.`
    : 'Complete more focus sessions to receive personalized recommendations.';
  
  return {
    optimalDayOfWeek: optimalDay.count > 0 ? optimalDay.day : null,
    optimalTimeOfDay: optimalTime.count > 0 ? optimalTime.time : null,
    recommendation
  };
};

/**
 * Generate productivity forecast based on historical data
 */
export const generateProductivityForecast = (days: number = 30) => {
  const sessions = getSessions();
  const completedSessions = sessions.filter(s => s.completed);
  
  if (completedSessions.length < 7) {
    return {
      forecast: [],
      projectedScore: null,
      recommendation: 'Complete at least 7 days of focus sessions to receive a productivity forecast.'
    };
  }
  
  // Calculate average daily focus time
  const dailyFocusTimes: { [key: string]: number } = {};
  completedSessions.forEach(session => {
    const dateStr = new Date(session.timestamp).toISOString().split('T')[0];
    dailyFocusTimes[dateStr] = (dailyFocusTimes[dateStr] || 0) + session.durationMinutes;
  });
  
  const dailyAvg = Object.values(dailyFocusTimes).reduce((sum, min) => sum + min, 0) / Object.keys(dailyFocusTimes).length;
  
  // Calculate trend (simple linear regression)
  const dateValues = Object.keys(dailyFocusTimes).map(date => new Date(date).getTime());
  const minutesValues = Object.values(dailyFocusTimes);
  
  const n = dateValues.length;
  const avgX = dateValues.reduce((sum, x) => sum + x, 0) / n;
  const avgY = minutesValues.reduce((sum, y) => sum + y, 0) / n;
  
  let slope = 0;
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (dateValues[i] - avgX) * (minutesValues[i] - avgY);
    denominator += Math.pow(dateValues[i] - avgX, 2);
  }
  
  if (denominator !== 0) {
    slope = numerator / denominator;
  }
  
  const intercept = avgY - slope * avgX;
  
  // Generate forecast
  const today = new Date();
  const forecast = [];
  
  for (let i = 1; i <= days; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i);
    const dateTime = forecastDate.getTime();
    
    // Predict minutes with some randomness
    let predictedMinutes = (slope * dateTime + intercept);
    
    // Add some randomness but ensure it's not negative
    const randomFactor = 0.2; // 20% randomness
    const randomVariation = (Math.random() * 2 - 1) * randomFactor * dailyAvg;
    predictedMinutes = Math.max(0, predictedMinutes + randomVariation);
    
    // Add day of week pattern (if any)
    const dayOfWeek = forecastDate.getDay();
    const dayStats = completedSessions.filter(s => new Date(s.timestamp).getDay() === dayOfWeek);
    if (dayStats.length > 0) {
      const dayAvg = dayStats.reduce((sum, s) => sum + s.durationMinutes, 0) / dayStats.length;
      const dayRatio = dayAvg / dailyAvg;
      predictedMinutes = predictedMinutes * (0.7 + 0.3 * dayRatio); // Blend prediction with day pattern
    }
    
    forecast.push({
      date: forecastDate.toISOString().split('T')[0],
      formattedDate: forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      predictedMinutes: Math.round(predictedMinutes)
    });
  }
  
  // Calculate projected productivity score
  const projectedDailyMinutes = forecast.reduce((sum, day) => sum + day.predictedMinutes, 0) / days;
  const projectedScore = Math.min(100, Math.round((projectedDailyMinutes / 120) * 100)); // Assuming 120 min/day is optimal
  
  // Generate recommendation
  let recommendation = '';
  if (slope > 0) {
    recommendation = 'Your focus time is trending upward. Keep up the good work!';
  } else if (slope < 0) {
    recommendation = 'Your focus time is trending downward. Consider setting regular focus sessions to maintain productivity.';
  } else {
    recommendation = 'Your focus time is stable. Consider increasing session duration to boost productivity.';
  }
  
  return {
    forecast,
    projectedScore,
    recommendation
  };
};

/**
 * Export data as CSV format
 */
export const exportDataAsCSV = (data: Record<string, any>[]): string => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
};
