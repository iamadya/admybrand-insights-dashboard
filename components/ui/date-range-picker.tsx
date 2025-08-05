'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { buttonVariants } from '@/components/ui/button';

interface DateRangePickerProps {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  date,
  onDateChange,
  placeholder = "Pick a date range",
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) {
      return placeholder;
    }

    if (!dateRange.to) {
      return format(dateRange.from, 'LLL dd, y');
    }

    return `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`;
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              onDateChange?.(newDate);
              // Close popover when both dates are selected
              if (newDate?.from && newDate?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Preset date ranges
export const dateRangePresets = [
  {
    label: 'Today',
    value: () => ({
      from: new Date(),
      to: new Date(),
    }),
  },
  {
    label: 'Yesterday',
    value: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        from: yesterday,
        to: yesterday,
      };
    },
  },
  {
    label: 'Last 7 days',
    value: () => {
      const from = new Date();
      from.setDate(from.getDate() - 6);
      return {
        from,
        to: new Date(),
      };
    },
  },
  {
    label: 'Last 30 days',
    value: () => {
      const from = new Date();
      from.setDate(from.getDate() - 29);
      return {
        from,
        to: new Date(),
      };
    },
  },
  {
    label: 'This month',
    value: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        from,
        to: new Date(),
      };
    },
  },
  {
    label: 'Last month',
    value: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        from,
        to,
      };
    },
  },
  {
    label: 'This year',
    value: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), 0, 1);
      return {
        from,
        to: new Date(),
      };
    },
  },
];

// Advanced date range picker with presets
interface DateRangePickerWithPresetsProps extends DateRangePickerProps {
  showPresets?: boolean;
  presets?: typeof dateRangePresets;
}

export function DateRangePickerWithPresets({
  date,
  onDateChange,
  placeholder = "Pick a date range",
  className,
  disabled = false,
  showPresets = true,
  presets = dateRangePresets,
}: DateRangePickerWithPresetsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLargeScreen, setIsLargeScreen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date | undefined>(
    date?.from ? new Date(date.from) : new Date()
  );

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  React.useEffect(() => {
    // Update current month when date changes
    if (date?.from) {
      setCurrentMonth(new Date(date.from));
    }
  }, [date]);

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) {
      return placeholder;
    }

    if (!dateRange.to) {
      return format(dateRange.from, 'LLL dd, y');
    }

    // On mobile, use shorter date format
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return `${format(dateRange.from, 'MM/dd/yy')}${dateRange.to ? ` - ${format(dateRange.to, 'MM/dd/yy')}` : ''}`;
    }

    return `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`;
  };

  const handlePreviousMonth = () => {
    if (currentMonth) {
      const previousMonth = new Date(currentMonth);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      setCurrentMonth(previousMonth);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth) {
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setCurrentMonth(nextMonth);
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal text-xs sm:text-sm truncate',
              !date && 'text-muted-foreground'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{formatDateRange(date)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 max-w-[90vw] sm:max-w-none sm:min-w-[500px] date-picker-popover">
          <div className="flex flex-col lg:flex-row max-h-[80vh] overflow-hidden">
            {showPresets && (
              <div className="border-b lg:border-b-0 lg:border-r p-2 lg:p-3 lg:min-w-[180px]">
                <div className="text-xs sm:text-sm font-medium mb-1 lg:mb-2">Quick Select</div>
                <div className="flex flex-wrap gap-1 lg:flex-col lg:space-y-1">
                  {presets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      size="sm"
                      className="justify-start text-xs lg:text-sm lg:w-full flex-shrink-0 h-7 lg:h-8 px-2 py-1"
                      onClick={() => {
                        const range = preset.value();
                        onDateChange?.(range);
                        setCurrentMonth(range.from);
                        setIsOpen(false);
                      }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="p-2 lg:p-4 overflow-auto flex justify-center flex-grow">
              <div className="relative w-full max-w-[320px]">
                <div className="flex items-center justify-between mb-2 px-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-muted"
                    onClick={handlePreviousMonth}
                    type="button"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous month</span>
                  </Button>
                  <div className="text-sm font-medium">
                    {currentMonth && format(currentMonth, 'MMMM yyyy')}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-muted"
                    onClick={handleNextMonth}
                    type="button"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next month</span>
                  </Button>
                </div>
                <DayPicker
                  mode="range"
                  defaultMonth={currentMonth}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  selected={date}
                  onSelect={(newDate) => {
                    onDateChange?.(newDate);
                    // Close popover when both dates are selected
                    if (newDate?.from && newDate?.to) {
                      setIsOpen(false);
                    }
                  }}
                  numberOfMonths={1}
                  showOutsideDays={true}
                  className="w-full"
                  classNames={{
                    months: 'flex flex-col space-y-4',
                    month: 'space-y-4',
                    caption: 'hidden', // Hide the caption completely
                    table: 'w-full border-collapse space-y-1',
                    head_row: 'flex',
                    head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                    row: 'flex w-full mt-2',
                    cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                    day: cn(
                      buttonVariants({ variant: 'ghost' }),
                      'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
                    ),
                    day_range_end: 'day-range-end',
                    day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                    day_today: 'bg-accent text-accent-foreground',
                    day_outside: 'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                    day_disabled: 'text-muted-foreground opacity-50',
                    day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                    day_hidden: 'invisible',
                  }}
                  components={{
                    IconLeft: () => null,  // Hide the default left icon
                    IconRight: () => null, // Hide the default right icon
                  }}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
