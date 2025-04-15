import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bot, Calendar, GripVertical } from 'lucide-react';
import type { Task } from '@/types/task';
import { useCategoryStore } from '@/store/useCategoryStore';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { format } from 'date-fns';
import { MouseEvent } from 'react';
import useMatrixStore from '@/store/matrixStore';
import { cn } from '@/lib/utils.ts';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  layout?: 'matrix' | 'board';
  dragHandle?: 'full';
  className?: string;
}

export function TaskCard({
  task,
  onClick,
  layout = 'matrix',
  dragHandle,
  className,
}: TaskCardProps) {
  const { id, title, memo, dueDate, type, category_id } = task;
  const { categories } = useCategoryStore();
  const category = categories.find((cat) => cat.id === category_id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { ...task } });

  const completeTask = useMatrixStore((state) => state.completeTask);

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleClick = (e: MouseEvent) => {
    const checkIcon = e.currentTarget.querySelector('.check-icon');
    if (checkIcon && checkIcon.contains(e.target as Node)) {
      return;
    }

    if (!isDragging && onClick) onClick();
  };

  const handleTaskComplete = () => {
    completeTask(id);
  };

  return (
    <div className="group w-full">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...(dragHandle === 'full' ? listeners : {})}
        onClick={handleClick}
        className={cn(
          `bg-white rounded-md p-4 ${layout === 'board' ? 'w-full' : ''} ${
            isDragging
              ? 'opacity-50 z-10 shadow-lg border-2 border-purple-300'
              : 'border border-gray-100'
          } transition-all duration-200 ${
            dragHandle === 'full'
              ? 'cursor-grab active:cursor-grabbing'
              : 'cursor-pointer'
          } hover:shadow-md flex flex-col relative`,
          className,
        )}
      >
        <div className="relative group">
          <div className="absolute top-1 right-1 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-gray-400 hover:text-gray-600 transition-colors">
              <Bot />
            </span>
            {dragHandle !== 'full' && (
              <div {...listeners} className="cursor-move">
                <span className="text-xs text-gray-400">
                  <GripVertical />
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex mb-2 flex-wrap gap-1">
          <TypeBadge type={type} />
          {category && (
            <CategoryBadge
              label={category.title}
              bgColor={category.color}
              textColor={category.textColor}
            />
          )}
        </div>

        <div className="flex items-center mb-2 flex-grow ">
          <div
            onClick={handleTaskComplete}
            className="check-icon w-[18px] h-[18px] rounded-full border-2 border-[#8d5cf6] mr-2 flex-shrink-0"
          ></div>
          <div className="text-md font-medium line-clamp-2 text-center">
            {title}
          </div>
        </div>

        {memo && (
          <div className="text-xs text-[#6e726e] mb-2 line-clamp-2">{memo}</div>
        )}

        {dueDate && (
          <div className="text-xs flex items-center mt-auto text-[color:var(--color-primary-100)]">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{format(new Date(dueDate), 'yyyy.MM.dd')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
