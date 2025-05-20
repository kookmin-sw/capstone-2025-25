import { useState, useEffect } from 'react';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import Calendar from '@/assets/eisenhower/calander_fill.svg';
import { showToast } from '@/components/common/Toast.tsx';

type DateRangePickerProps = {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
};

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: startDate,
    to: endDate,
  });

  useEffect(() => {
    if (dateRange.from) {
      onDateChange(dateRange.from, dateRange.to ?? dateRange.from);
    }
  }, [dateRange, onDateChange]);

  const formatDateRange = () => {
    if (!dateRange.from) return '날짜 선택';

    const from = dateRange.from;
    const to = dateRange.to ?? from;

    const isSameDay = from.getTime() === to.getTime();
    const isSameMonth =
      format(from, 'yyyy-MM', { locale: ko }) ===
      format(to, 'yyyy-MM', { locale: ko });

    if (isSameDay) {
      return format(from, 'yyyy년 MM월 dd일', { locale: ko });
    }

    if (isSameMonth) {
      return `${format(from, 'yyyy년 MM월 dd일', { locale: ko })} - ${format(to, 'dd일', { locale: ko })}`;
    }

    return `${format(from, 'yyyy년 MM월 dd일', { locale: ko })} - ${format(to, 'yyyy년 MM월 dd일', { locale: ko })}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center w-full md:w-auto min-w-[100px] bg-white shadow-none text-black p-0 hover:bg-white cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-7 h-7 flex items-center justify-center bg-blue rounded-full">
              {/*<CalendarIcon className="w-4 h-4 text-[#E8EFFF]" />*/}
              <img src={Calendar} alt="calendar" />
            </div>
            <span className="leading-none whitespace-nowrap">
              {formatDateRange()}
            </span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col md:flex-row">
          <CalendarComponent
            mode="range"
            defaultMonth={dateRange.from}
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                const isSameDay = range.from.getTime() === range.to.getTime();

                if (isSameDay) {
                  setDateRange({ from: null as any, to: undefined });
                  onDateChange(null, null);
                  setIsOpen(false);
                } else {
                  setDateRange({ from: range.from, to: range.to });
                  onDateChange(range.from, range.to);
                  setIsOpen(false);
                }
              } else if (range?.from) {
                setDateRange({ from: range.from, to: undefined });
                onDateChange(range.from, range.from);
              }
            }}
            numberOfMonths={2}
            locale={ko}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
