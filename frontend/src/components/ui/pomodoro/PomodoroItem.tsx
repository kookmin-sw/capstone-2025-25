import { Link, X } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

import { LinkedUnlinkedPomodoro, TotalTime } from '@/types/pomodoro.ts';
import DeletePomodoro from '@/components/ui/Modal/DeletePomodoro.tsx';
import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router';

export type PomodoroItemProps = {
  item: LinkedUnlinkedPomodoro;
  selected?: boolean;
};

// 시간 포맷 함수
function formatToHourMin(timeObj: TotalTime): string {
  const { hour, minute } = timeObj;
  const parts = [];

  if (hour > 0) parts.push(`${hour}h`);
  if (minute > 0 || parts.length === 0) parts.push(`${minute}min`);

  return parts.join(' ');
}

const deletePomodoro = () => {};

export function PomodoroItem({ item, selected }: PomodoroItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const id = item.pomodoro.id;

  const pomodoroClick = (e: MouseEvent) => {
    const closeButton = e.currentTarget.querySelector('.close-button');
    if (closeButton && closeButton.contains(e.target as Node)) {
      return;
    }

    const target = e.target as HTMLElement;
    if (
      target.getAttribute('data-slot') === 'dialog-overlay' ||
      target.closest('[data-slot="dialog-overlay"]')
    ) {
      return;
    }

    navigate(`/pomodoro/${id}`);
  };

  const cardBg = selected ? 'bg-[#ECE5FF] rounded-lg' : 'bg-white';


  return (
    <div
      className={cn(
        'flex flex-col gap-[5px] p-5 rounded-md  cursor-pointer border-b hover:bg-[rgba(123,104,238,0.1)] transition-colors group',
          cardBg
      )}
      onClick={(e) => pomodoroClick(e)}
    >
      <div className="flex justify-between pl-1">
        <p className="font-semibold text-[16px]">{item.pomodoro.title}</p>
        <DeletePomodoro
          trigger={
            <button
              className={'close-button cursor-pointer hidden group-hover:block'}
              onClick={deletePomodoro}
            >
              <X className=" text-gray-700" size={18}/>
            </button>
          }
          linkedUnlinkedPomodoro={item}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>

      {item.eisenhower && (
        <div className="flex justify-end gap-1 w-full items-center">
          <Link className="text-[#9F4BC9]" size={14} />
          <p className="text-[#9F4BC9]  text-[14px]">{item.eisenhower?.title}</p>
        </div>
      )}

      <div className="px-1">
        <p className="text-[14px] text-[#6E726E]">
          {formatToHourMin(item.pomodoro.totalExecutedTime)}
        </p>
      </div>
    </div>
  );
}
