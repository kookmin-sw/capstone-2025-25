import { format, parseISO, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

type SingleDatePickerProps = {
  date: string | null;
  onChange: (date: string | null) => void;
};

export function SingleDatePicker({ date, onChange }: SingleDatePickerProps) {
  const parsedDate = date ? parseISO(date) : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-between w-full md:w-auto min-w-[160px] bg-white shadow-none text-black p-0 hover:bg-white cursor-pointer">
          <div className="flex items-center">
            <span className="text-sm">
              {parsedDate && isValid(parsedDate)
                ? format(parsedDate, 'yyyy년 MM월 dd일', { locale: ko })
                : '날짜 없음'}
            </span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={parsedDate ?? undefined}
          onSelect={(selected) => {
            onChange(selected ? format(selected, 'yyyy-MM-dd') : null);
          }}
          locale={ko}
        />
      </PopoverContent>
    </Popover>
  );
}
