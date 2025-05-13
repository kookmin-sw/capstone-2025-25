import { Calendar } from 'lucide-react';
import type { Category } from '@/types/category';
import { getCategoryNameById } from '@/utils/category';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { Task } from '@/types/task.ts';
import { format } from 'date-fns';

export interface DragOverlayCardProps {
  task: Task;
  categories: Category[];
}

export function DragOverlayCard({ task, categories }: DragOverlayCardProps) {
  const { title, categoryId, dueDate, memo } = task;
  const categoryName = getCategoryNameById(categoryId, categories);
  const category = categories.find((c) => c.id === categoryId); // ✅ 여기 추가

  return (
    <div className="bg-white rounded-md p-4 shadow-lg w-full flex flex-col">
      <div className="flex mb-2 flex-wrap">
        {categoryId !== null && (
          <CategoryBadge
            label={categoryName}
            bgColor={category?.color ?? '#E8EFFF'}
          />
        )}
      </div>

      <div className="flex items-start mb-2 flex-grow">
        <div className="text-sm font-medium line-clamp-2">{title}</div>
      </div>

      {memo && (
        <div className="text-xs text-[#6e726e]  mb-2 line-clamp-2">{memo}</div>
      )}

      {dueDate && (
        <div className="text-xs flex items-center mt-auto text-[#525463]">
          <Calendar className="w-4 h-4 mr-1 text-blue" />
          <span className="text-center pt-[2px] text-xs">
            {format(new Date(dueDate), 'yyyy.MM.dd')}
          </span>
        </div>
      )}
    </div>
  );
}
