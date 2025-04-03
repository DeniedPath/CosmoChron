import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Activity, 
  BarChart2, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange, getDateRanges, calculateProductivityScore } from '@/utils/analytics/dataProcessing';
import ProductivityScore from './ProductivityScore';
import DailyFocusChart from './DailyFocusChart';
import WeeklyTrendChart from './WeeklyTrendChart';
import MonthlyAnalysisChart from './MonthlyAnalysisChart';
import YearlyComparisonChart from './YearlyComparisonChart';
import DateRangeSelector from './DateRangeSelector';

// import { PieChartIcon, Filter, RefreshCw } from 'lucide-react'; // Removed unused import

const AnalyticsDashboard: React.FC = () => {
  // Date range state
  const dateRanges = useMemo(() => getDateRanges(), []);
  const [selectedRange, setSelectedRange] = useState<DateRange>(dateRanges.thisWeek);
  const [customRange, setCustomRange] = useState<DateRange | null>(null);
  const [activeRange, setActiveRange] = useState('thisWeek');
  
  // Productivity score
  const productivityScore = useMemo(() => 
    calculateProductivityScore(customRange || selectedRange), 
    [customRange, selectedRange]
  );
  
  // Handle date range change
  const handleRangeChange = (rangeKey: string) => {
    setActiveRange(rangeKey);
    if (rangeKey === 'custom') {
      // Custom range already set in the DateRangeSelector component
      return;
    }
    setSelectedRange(dateRanges[rangeKey as keyof typeof dateRanges]);
    setCustomRange(null);
  };
  
  // Handle custom date range selection
  const handleCustomRange = (range: DateRange) => {
    setCustomRange(range);
    setActiveRange('custom');
  };
  
  return (
    <div className="space-y-6 w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-cosmic-white">Advanced Analytics</h2>
          <p className="text-cosmic-white/70">Gain insights into your productivity patterns</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <DateRangeSelector 
            onRangeChange={handleRangeChange}
            onCustomRange={handleCustomRange}
            activeRange={activeRange}
          />
          
          <Button variant="outline" size="sm" className="bg-cosmic-blue/20 border-cosmic-highlight/20 text-cosmic-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Productivity Score */}
      <ProductivityScore score={productivityScore} />
      
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="mb-4 bg-cosmic-blue/30 backdrop-blur-md border border-cosmic-highlight/20 p-1">
          <TabsTrigger value="daily" className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white">
            <Activity className="w-4 h-4 mr-2" />
            Daily Focus
          </TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white">
            <BarChart2 className="w-4 h-4 mr-2" />
            Weekly Trends
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white">
            <Calendar className="w-4 h-4 mr-2" />
            Monthly Analysis
          </TabsTrigger>
          <TabsTrigger value="yearly" className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Yearly Comparison
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-cosmic-purple/40 data-[state=active]:text-cosmic-white">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        {/* Daily Focus Tab */}
        <TabsContent value="daily" className="mt-0">
          <DailyFocusChart dateRange={customRange || selectedRange} />
        </TabsContent>
        
        {/* Weekly Trends Tab */}
        <TabsContent value="weekly" className="mt-0">
          <WeeklyTrendChart dateRange={customRange || selectedRange} />
        </TabsContent>
        
        {/* Monthly Analysis Tab */}
        <TabsContent value="monthly" className="mt-0">
          <MonthlyAnalysisChart dateRange={customRange || selectedRange} />
        </TabsContent>
        
        {/* Yearly Comparison Tab */}
        <TabsContent value="yearly" className="mt-0">
          <YearlyComparisonChart dateRange={customRange || selectedRange} />
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-0">
          <Card className="bg-cosmic-blue/20 border-cosmic-highlight/20 backdrop-blur-lg">
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription className="text-cosmic-white/70">
                Create detailed reports of your productivity data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-cosmic-white/70 mb-4">
                Select a report template and customize options to generate detailed productivity reports.
              </p>
              <div className="grid gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select defaultValue="weekly">
                    <SelectTrigger className="bg-cosmic-blue/30 border-cosmic-highlight/20 text-cosmic-white">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Focus Report</SelectItem>
                      <SelectItem value="weekly">Weekly Progress Report</SelectItem>
                      <SelectItem value="monthly">Monthly Achievement Report</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-cosmic-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate PDF Report
                  </Button>
                  
                  <Button variant="outline" className="bg-cosmic-blue/20 border-cosmic-highlight/20 text-cosmic-white">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
