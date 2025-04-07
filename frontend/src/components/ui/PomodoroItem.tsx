import { Link, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PomodoroItemProps } from '@/types/pomodoro.ts';

// 시간 포멧
function formatToHourMin(time: string): string {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  const parts = [];
  if (hours > 0) parts.push(`${hours} h`);
  if (minutes >= 0 || parts.length === 0) parts.push(`${minutes} min`);

  return parts.join(' ');
}

export function PomodoroItem({
  title,
  eisenhower,
  time,
  selected,
}: PomodoroItemProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 p-5 rounded-md  cursor-pointer hover:bg-[rgba(123,104,238,0.1)] transition-colors group',
        selected &&
          'bg-[rgba(123,104,238,0.2)] hover:bg-[rgba(123,104,238,0.2)]',
      )}
    >
      <div className="flex justify-between px-1">
        <p className="font-semibold text-lg">{title}</p>
        <button className={'cursor-pointer hidden group-hover:block'}>
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {eisenhower && (
        <div className="flex justify-end gap-2 w-full items-center">
          <Link className="text-[#9F4BC9] w-4 h-4" />
          <p className="text-[#9F4BC9] text-base">{eisenhower.title}</p>
        </div>
      )}

      <div className="px-1">
        <p className="text-sm text-gray-500">{formatToHourMin(time)}</p>
      </div>
    </div>
  );
}
