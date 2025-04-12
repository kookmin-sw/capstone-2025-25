import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge.tsx';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge.tsx';
import { useSortable } from '@dnd-kit/sortable';
import { Task } from '@/types/task.ts';
import { CSS } from '@dnd-kit/utilities';
import { Calendar } from 'lucide-react';

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
  layout?: 'matrix' | 'board';
};

export function TaskCard({ task, onClick, layout = 'matrix' }: TaskCardProps) {
  const { id, title, memo, date, tags } = task;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { ...task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="py-1 group">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`bg-white rounded-md p-3 ${layout === 'board' ? 'w-full' : ''} ${
          isDragging
            ? 'opacity-50 z-10 shadow-lg border-2 border-purple-300'
            : 'border border-gray-100'
        } transition-all duration-200 cursor-pointer hover:shadow-md flex flex-col relative`}
        onClick={() => {
          if (!isDragging && onClick) onClick();
        }}
      >
        {/* 드래그 핸들 전용 영역 */}
        <div {...listeners} className="absolute top-1 right-1 p-1 cursor-move">
          <span className="text-xs text-gray-400">↕</span>
        </div>

        <div className="flex mb-2 flex-wrap gap-1">
          <TypeBadge type={tags.type} />
          {tags.category && (
            <CategoryBadge
              label={tags.category}
              colorClass="bg-yellow-100 text-yellow-600"
            />
          )}
        </div>

        <div className="flex items-start mb-2 flex-grow">
          <div className="w-4 h-4 rounded-full border-2 border-[#8d5cf6] mr-2 mt-0.5 flex-shrink-0"></div>
          <div className="text-sm font-medium line-clamp-2">{title}</div>
        </div>

        {memo && (
          <div className="text-xs text-[#6e726e] mb-2 line-clamp-2">{memo}</div>
        )}

        {date && (
          <div className="text-xs text-[#6e726e] flex items-center mt-auto">
            <Calendar className="w-3 h-3 mr-1" />
            <span>
              {typeof date === 'string'
                ? date
                : date.toISOString().split('T')[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
