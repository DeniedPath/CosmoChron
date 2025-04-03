/**
 * Utilities for generating analytics reports
 */
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DateRange, getSessionsByDateRange, calculateProductivityScore, exportDataAsCSV } from './dataProcessing';

// Extend jsPDF with autotable (already declared in jspdf-autotable.d.ts)
declare module 'jspdf' {
    interface jsPDF {
        lastAutoTable: {
            finalY: number;
        };
    }
}

export interface ReportOptions {
  title: string;
  dateRange: DateRange;
  includeProductivityScore?: boolean;
  includeDailyBreakdown?: boolean;
  includeSessionList?: boolean;
  includeCharts?: boolean;
  logo?: string;
}

/**
 * Generate a PDF report with session data
 */
export const generatePDFReport = (options: ReportOptions): jsPDF => {
  const { title, dateRange, includeProductivityScore = true, includeDailyBreakdown = true, includeSessionList = true } = options;
  
  // Get sessions for the date range
  const sessions = getSessionsByDateRange(dateRange);
  const completedSessions = sessions.filter(s => s.completed);
  
  // Create PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(75, 86, 207); // Cosmic purple
  doc.text(title, 105, 15, { align: 'center' });
  
  // Add date range
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  const dateRangeText = `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
  doc.text(dateRangeText, 105, 22, { align: 'center' });
  
  // Add line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 25, 190, 25);
  
  let yPosition = 35;
  
  // Add summary statistics
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  doc.text('Summary', 20, yPosition);
  
  yPosition += 8;
  doc.setFontSize(12);
  
  const totalSessions = completedSessions.length;
  const totalMinutes = completedSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const avgSessionLength = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
  
  doc.text(`Total Sessions: ${totalSessions}`, 25, yPosition);
  yPosition += 6;
  doc.text(`Total Focus Time: ${totalMinutes} minutes (${Math.floor(totalMinutes / 60)} hrs ${totalMinutes % 60} min)`, 25, yPosition);
  yPosition += 6;
  doc.text(`Average Session Length: ${avgSessionLength} minutes`, 25, yPosition);
  yPosition += 6;
  
  // Add productivity score if requested
  if (includeProductivityScore) {
    yPosition += 8;
    doc.setFontSize(14);
    doc.text('Productivity Score', 20, yPosition);
    yPosition += 8;
    
    const productivityScore = calculateProductivityScore(dateRange);
    
    doc.setFontSize(12);
    doc.text(`Score: ${productivityScore.score}/100`, 25, yPosition);
    yPosition += 6;
    doc.text(`Level: ${productivityScore.level}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Insight: ${productivityScore.description}`, 25, yPosition);
    yPosition += 10;
  }
  
  // Add daily breakdown if requested
  if (includeDailyBreakdown && completedSessions.length > 0) {
    // Group sessions by day
    const dailyData: { [key: string]: number } = {};
    
    completedSessions.forEach(session => {
      const dateStr = new Date(session.timestamp).toLocaleDateString();
      dailyData[dateStr] = (dailyData[dateStr] || 0) + session.durationMinutes;
    });
    
    const dailyBreakdown = Object.entries(dailyData).map(([date, minutes]) => ({
      date,
      minutes,
      hours: Math.floor(minutes / 60),
      remainingMinutes: minutes % 60
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    yPosition += 5;
    doc.setFontSize(14);
    doc.text('Daily Breakdown', 20, yPosition);
    yPosition += 5;
    
    // Create table
    doc.autoTable({
      startY: yPosition,
      head: [['Date', 'Focus Time']],
      body: dailyBreakdown.map(day => [
        day.date,
        `${day.hours} hr ${day.remainingMinutes} min`
      ]),
      theme: 'grid',
      headStyles: { fillColor: [110, 86, 207], textColor: [255, 255, 255] },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 }
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
  }
  
  // Add session list if requested
  if (includeSessionList && completedSessions.length > 0) {
    // Check if we need a new page
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Session Details', 20, yPosition);
    yPosition += 5;
    
    // Format sessions for table
    const sessionDetails = completedSessions.map(session => ({
      date: new Date(session.timestamp).toLocaleDateString(),
      time: new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: session.durationMinutes
    })).sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
    
    // Create table
    doc.autoTable({
      startY: yPosition,
      head: [['Date', 'Time', 'Duration (min)']],
      body: sessionDetails.map(session => [
        session.date,
        session.time,
        session.duration.toString()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [110, 86, 207], textColor: [255, 255, 255] },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 }
    });
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Generated on ${new Date().toLocaleString()} | Cosmic Timer Analytics | Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
  }
  
  return doc;
};

/**
 * Generate a CSV report with session data
 */
export const generateCSVReport = (dateRange: DateRange): string => {
  const sessions = getSessionsByDateRange(dateRange);
  const completedSessions = sessions.filter(s => s.completed);
  
  if (completedSessions.length === 0) {
    return 'No completed sessions found in the selected date range.';
  }
  
  // Format sessions for CSV
  const formattedSessions = completedSessions.map(session => {
    const date = new Date(session.timestamp);
    return {
      Date: date.toLocaleDateString(),
      Time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      'Duration (minutes)': session.durationMinutes,
      'Focus Score': calculateFocusScore(session.durationMinutes)
    };
  });
  
  return exportDataAsCSV(formattedSessions);
};

/**
 * Calculate a focus score for a single session
 */
const calculateFocusScore = (durationMinutes: number): number => {
  // Simple scoring algorithm based on duration
  if (durationMinutes >= 90) return 100;
  if (durationMinutes >= 60) return 90;
  if (durationMinutes >= 45) return 80;
  if (durationMinutes >= 30) return 70;
  if (durationMinutes >= 25) return 65;
  if (durationMinutes >= 20) return 60;
  if (durationMinutes >= 15) return 50;
  if (durationMinutes >= 10) return 40;
  if (durationMinutes >= 5) return 30;
  return 20;
};

/**
 * Get available report templates
 */
export const getReportTemplates = () => {
  return [
    {
      id: 'daily',
      name: 'Daily Focus Report',
      description: 'Summary of your focus sessions for a single day',
      options: {
        includeProductivityScore: true,
        includeSessionList: true,
        includeDailyBreakdown: false
      }
    },
    {
      id: 'weekly',
      name: 'Weekly Progress Report',
      description: 'Detailed analysis of your weekly focus patterns',
      options: {
        includeProductivityScore: true,
        includeSessionList: true,
        includeDailyBreakdown: true
      }
    },
    {
      id: 'monthly',
      name: 'Monthly Achievement Report',
      description: 'Comprehensive overview of your monthly focus achievements',
      options: {
        includeProductivityScore: true,
        includeSessionList: false,
        includeDailyBreakdown: true
      }
    },
    {
      id: 'custom',
      name: 'Custom Report',
      description: 'Fully customizable report with your preferred metrics',
      options: {
        includeProductivityScore: true,
        includeSessionList: true,
        includeDailyBreakdown: true
      }
    }
  ];
};
