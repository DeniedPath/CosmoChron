import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange as CustomDateRange, createCustomDateRange } from '@/utils/analytics/dataProcessing';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DateRangeSelectorProps {
  onRangeChange: (rangeKey: string) => void;
  onCustomRange: (range: CustomDateRange) => void;
  activeRange: string;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onRangeChange,
  onCustomRange,
  activeRange
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date>(new Date());
  const [customEndDate, setCustomEndDate] = useState<Date>(new Date());
  
  // Format the display of the date range
  const formatDateRange = () => {
    if (activeRange === 'today') return 'Today';
    if (activeRange === 'yesterday') return 'Yesterday';
    if (activeRange === 'thisWeek') return 'This Week';
    if (activeRange === 'lastWeek') return 'Last Week';
    if (activeRange === 'thisMonth') return 'This Month';
    if (activeRange === 'lastMonth') return 'Last Month';
    if (activeRange === 'thisYear') return 'This Year';
    if (activeRange === 'lastYear') return 'Last Year';
    if (activeRange === 'allTime') return 'All Time';
    if (activeRange === 'custom') {
      return `${format(customStartDate, 'MMM d, yyyy')} - ${format(customEndDate, 'MMM d, yyyy')}`;
    }
    return 'Select Range';
  };
  
  return (
    <div className="flex space-x-2">
      <Select value={activeRange} onValueChange={onRangeChange}>
        <SelectTrigger className="w-[180px] bg-cosmic-blue/20 border-cosmic-highlight/20 text-cosmic-white">
          <SelectValue placeholder={formatDateRange()} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="thisWeek">This Week</SelectItem>
          <SelectItem value="lastWeek">Last Week</SelectItem>
          <SelectItem value="thisMonth">This Month</SelectItem>
          <SelectItem value="lastMonth">Last Month</SelectItem>
          <SelectItem value="thisYear">This Year</SelectItem>
          <SelectItem value="lastYear">Last Year</SelectItem>
          <SelectItem value="allTime">All Time</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-cosmic-blue/20 border-cosmic-highlight/20 text-cosmic-white"
            onClick={() => {
              if (activeRange !== 'custom') {
                onRangeChange('custom');
              }
              setIsCalendarOpen(true);
            }}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            {activeRange === 'custom' ? formatDateRange() : 'Custom Range'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-cosmic-blue/90 border-cosmic-highlight/20" align="end">
          <Calendar
            mode="range"
            defaultMonth={new Date()}
            selected={{
              from: customStartDate,
              to: customEndDate
            }}
            onSelect={(range: { from?: Date; to?: Date } | undefined) => {
              if (range?.from) {
                setCustomStartDate(range.from);
                if (range.to) {
                  setCustomEndDate(range.to);
                  onCustomRange(createCustomDateRange(range.from, range.to));
                  setIsCalendarOpen(false);
                }
              }
            }}
            numberOfMonths={2}
            className="bg-cosmic-blue/90 text-cosmic-white"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeSelector;
