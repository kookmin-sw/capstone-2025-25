import { Link, X } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

import { LinkedUnlinkedPomodoro, TotalTime } from '@/types/pomodoro.ts';
import DeletePomodoro from '@/components/ui/Modal/DeletePomodoro.tsx';
import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import useMatrixStore from '@/store/matrixStore';

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
  const setActiveTaskId = useMatrixStore((state) => state.setActiveTaskId);

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

    const linkedButton = e.currentTarget.querySelector('.linked-icon');
    if (linkedButton && linkedButton.contains(e.target as Node)) {
      return;
    }

    navigate(`/pomodoro/${id}`);
  };

  const handleLinkedTaskClick = () => {
    const taskId = item.eisenhower?.id;

    if (taskId) {
      setActiveTaskId(taskId);
      navigate('/matrix');
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 p-5 rounded-md  cursor-pointer hover:bg-[rgba(123,104,238,0.1)] transition-colors group',
        selected &&
          'bg-[rgba(123,104,238,0.2)] hover:bg-[rgba(123,104,238,0.2)]',
      )}
      onClick={(e) => pomodoroClick(e)}
    >
      <div className="flex justify-between pl-1">
        <p className="font-semibold text-lg">{item.pomodoro.title}</p>
        <DeletePomodoro
          trigger={
            <button
              className={'close-button cursor-pointer hidden group-hover:block'}
              onClick={deletePomodoro}
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          }
          linkedUnlinkedPomodoro={item}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>

      {item.eisenhower && (
        <div
          onClick={handleLinkedTaskClick}
          className="linked-icon flex justify-end gap-2 w-full items-center"
        >
          <Link className="text-[#9F4BC9] w-4 h-4" />
          <p className="text-[#9F4BC9] text-base">{item.eisenhower?.title}</p>
        </div>
      )}

      <div className="px-1">
        <p className="text-sm text-gray-500">
          {formatToHourMin(item.pomodoro.totalExecutedTime)}
        </p>
      </div>
    </div>
  );
}
