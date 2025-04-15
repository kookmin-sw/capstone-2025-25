import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bot, Calendar, Check, GripVertical } from 'lucide-react';
import type { Task } from '@/types/task';
import { useCategoryStore } from '@/store/useCategoryStore';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { format } from 'date-fns';
import { MouseEvent } from 'react';
import useMatrixStore from '@/store/matrixStore';
import { cn } from '@/lib/utils';

type TaskCardVariant = 'default' | 'inactive' | 'done';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  layout?: 'matrix' | 'board';
  dragHandle?: 'full';
  className?: string;
  variant?: TaskCardVariant;
}

export function TaskCard({
  task,
  onClick,
  layout = 'matrix',
  dragHandle,
  className,
  variant = 'default',
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
    if (checkIcon && checkIcon.contains(e.target as Node)) return;
    if (!isDragging && variant === 'default' && onClick) onClick();
  };

  const handleTaskComplete = () => {
    if (variant === 'default') completeTask(id);
  };

  return (
    <div className="group w-full">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...(dragHandle === 'full' && variant === 'default' ? listeners : {})}
        onClick={handleClick}
        className={cn(
          'rounded-md p-4 flex flex-col relative transition-all duration-200',
          layout === 'board' ? 'w-full' : '',
          variant === 'default' && !isDragging && 'hover:shadow-md',
          variant === 'default'
            ? 'bg-white border border-gray-100 cursor-pointer'
            : 'bg-muted border border-gray-300 cursor-default shadow-none',
          isDragging &&
            'opacity-50 z-10 shadow-lg border-2 border-purple-300 cursor-grabbing',
          className,
        )}
      >
        {/* 상단 도구 아이콘 */}
        {variant === 'default' && (
          <div className="absolute p-2 top-1 right-1 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
        )}

        {/* 상단 뱃지 */}
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

        {/* 제목 + 체크 */}
        <div className="flex items-center mb-2 flex-grow">
          <div
            onClick={handleTaskComplete}
            className={cn(
              'check-icon w-[18px] h-[18px] rounded-full mr-2 flex-shrink-0 flex items-center justify-center',
              variant === 'done'
                ? 'bg-primary-100 text-white'
                : 'border border-primary-100',
            )}
          >
            {variant === 'done' && <Check className="w-3 h-3" />}
          </div>
          <div className={cn('text-md font-medium line-clamp-2')}>{title}</div>
        </div>

        {/* 메모 */}
        {memo && (
          <div className={cn('text-xs mb-2 line-clamp-2 text-gray-700')}>
            {memo}
          </div>
        )}

        {/* 마감일 */}
        {dueDate && (
          <div
            className={cn(
              'text-xs flex items-center mt-auto text-[color:var(--color-primary-100)]',
            )}
          >
            <Calendar className="w-3 h-3 mr-1" />
            <span className="text-ceter">
              {format(new Date(dueDate), 'yyyy.MM.dd')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
