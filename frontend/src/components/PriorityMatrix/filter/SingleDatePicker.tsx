'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

type SingleDatePickerProps = {
  date: Date;
  onDateChange?: (date: Date) => void;
};

export function SingleDatePicker({
  date,
  onDateChange,
}: SingleDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(date);

  useEffect(() => {
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  }, [selectedDate, onDateChange]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="primary"
          className="flex items-center justify-between w-full md:w-auto min-w-[160px] bg-white shadow-none text-black p-0 hover:bg-white cursor-pointer"
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 text-[#6e726e]" />
            <span className="text-sm">
              {selectedDate instanceof Date && !isNaN(selectedDate.getTime())
                ? format(selectedDate, 'yyyy년 MM월 dd일', { locale: ko })
                : '날짜 없음'}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              setSelectedDate(date);
              setIsOpen(false);
            }
          }}
          locale={ko}
        />
      </PopoverContent>
    </Popover>
  );
}
