import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bot, Calendar, Check, GripVertical } from 'lucide-react';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { format } from 'date-fns';
import { MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { EisenhowerBase } from '@/types/commonTypes';
import { Task } from '@/types/task.ts';
import { Category } from '@/types/category.ts';
import { eisenhowerService } from '@/services/eisenhowerService.ts';
import { toast } from 'sonner';

type TaskCardVariant = 'default' | 'inactive' | 'done';

interface TaskCardProps {
  task: EisenhowerBase & { categoryId?: number | null };
  categories: Category[];
  onClick?: () => void;
  layout?: 'matrix' | 'board';
  dragHandle?: 'full';
  className?: string;
  variant?: TaskCardVariant;
  onUpdateTask?: (task: Task) => void;
}

export function TaskCard({
  task,
  categories,
  onClick,
  layout = 'matrix',
  dragHandle,
  className,
  variant = 'default',
  onUpdateTask,
}: TaskCardProps) {
  const { id, title, memo, dueDate, categoryId } = task;

  const category = categoryId
    ? categories.find((cat) => cat.id === categoryId)
    : null;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { ...task } });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleClick = (e: MouseEvent) => {
    const checkIcon = e.currentTarget.querySelector('.check-icon');
    if (checkIcon && checkIcon.contains(e.target as Node)) return;
    if (!isDragging && variant === 'default' && onClick) onClick();
  };

  const handleTaskComplete = async (e: MouseEvent) => {
    e.stopPropagation();

    if (variant === 'default' || variant === 'done') {
      try {
        const updated = await eisenhowerService.update(task.id, {
          isCompleted: !task.isCompleted,
        });

        onUpdateTask?.({
          ...task,
          ...updated.content,
        });
        toast.success('할 일을 완료했습니다');
      } catch (err) {
        console.error('완료 상태 업데이트 실패:', err);
      }
    }
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
        <div className="absolute p-2 top-1 right-1 flex gap-2">
          {variant === 'default' && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <div
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Bot />
              </div>
              {dragHandle !== 'full' && (
                <div {...listeners} className="cursor-move">
                  <span className="text-xs text-gray-400">
                    <GripVertical />
                  </span>
                </div>
              )}
            </div>
          )}
          <div
            onClick={handleTaskComplete}
            className={cn(
              'check-icon w-[24px] h-[24px] rounded-full mr-2 flex-shrink-0 flex items-center justify-center cursor-pointer',
              variant === 'done' ? 'bg-blue text-white' : 'border border-blue',
            )}
          >
            {variant === 'done' && <Check className="w-3 h-3" />}
          </div>
        </div>

        {/* 상단 카테고리 뱃지 */}
        <div className="flex mb-2 flex-wrap gap-1">
          {category && (
            <CategoryBadge label={category.title} bgColor={category.color} />
          )}
        </div>

        <div className="flex items-center mb-2 flex-grow">
          <div
            className={cn(
              'text-md font-medium line-clamp-2',
              variant === 'done' ? 'text-gray-500' : 'text-black',
            )}
          >
            {title}
          </div>
        </div>

        {/* 메모 */}
        {memo && (
          <div className="text-xs mb-2 line-clamp-2 text-[#858899]">{memo}</div>
        )}

        {/* 마감일 */}
        {dueDate && (
          <div className="text-xs flex items-center mt-auto text-[#525463]">
            <Calendar className="w-3 h-3 mr-1" />
            <span className="text-center pt-[2px]">
              {format(new Date(dueDate), 'yyyy.MM.dd')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
