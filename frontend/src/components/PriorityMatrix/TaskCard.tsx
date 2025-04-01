import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCardType } from './data';
import { CalendarIcon } from 'lucide-react';

// import { CalendarIcon } from '@heroicons/react/solid';

interface Props {
  task: TaskCardType;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  const categoryColor = {
    default: 'bg-neutral-200 text-neutral-800',
    red: 'bg-red-100 text-red-600',
    brown: 'bg-amber-100 text-amber-700',
  };

  const categoryClass =
    task.category === '위험'
      ? categoryColor.red
      : task.category === '중요'
        ? categoryColor.brown
        : categoryColor.default;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col gap-2 text-sm"
    >
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full border border-purple-400 text-purple-600 text-xs font-medium">
          • Todo
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryClass}`}
        >
          {task.category || 'category'}
        </span>
      </div>

      <div className="flex items-start gap-2">
        <div className="text-purple-500 text-lg">◯</div>
        <div className="flex flex-col">
          <div className="text-base font-semibold">{task.title}</div>
          {task.memo && (
            <div className="text-sm text-gray-500">{task.memo}</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 text-purple-600 text-xs mt-1">
        <CalendarIcon className="w-4 h-4" />
        <span>{task.date || '날짜 없음'}</span>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 text-xs"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
