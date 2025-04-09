import { Link, X } from 'lucide-react';
import { cn } from '@/lib/utils';

import {LinkedUnlinkedPomodoro, TotalTime} from '@/types/pomodoro';

export type PomodoroItemProps = {
  item: LinkedUnlinkedPomodoro;
  selected?: boolean;
  onClick?: () => void;
};


// 시간 포맷 함수
function formatToHourMin(timeObj: TotalTime): string {
  const { hour, minute } = timeObj;
  const parts = [];

  if (hour > 0) parts.push(`${hour}h`);
  if (minute > 0 || parts.length === 0) parts.push(`${minute}min`);

  return parts.join(' ');
}

export function PomodoroItem({ item, selected,onClick }: PomodoroItemProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 p-5 rounded-md  cursor-pointer hover:bg-[rgba(123,104,238,0.1)] transition-colors group',
        selected &&
          'bg-[rgba(123,104,238,0.2)] hover:bg-[rgba(123,104,238,0.2)]',
      )}
      onClick={onClick}
    >
      <div className="flex justify-between pl-1">
        <p className="font-semibold text-lg">{item.pomodoro.title}</p>
        <button className={'cursor-pointer hidden group-hover:block'}>
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {item.eisenhower && (
        <div className="flex justify-end gap-2 w-full items-center">
          <Link className="text-[#9F4BC9] w-4 h-4" />
          <p className="text-[#9F4BC9] text-base">{item.eisenhower?.title}</p>
        </div>
      )}

      <div className="px-1">
        <p className="text-sm text-gray-500">{formatToHourMin(item.pomodoro.totalExecutedTime)}</p>
      </div>
    </div>
  );
}
