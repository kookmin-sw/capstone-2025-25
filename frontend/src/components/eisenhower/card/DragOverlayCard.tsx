import { Calendar } from 'lucide-react';
import type { Category } from '@/types/category';
import { getCategoryNameById } from '@/utils/category';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { Task } from '@/types/task.ts';

export interface DragOverlayCardProps {
  task: Task;
  categories: Category[];
}

export function DragOverlayCard({ task, categories }: DragOverlayCardProps) {
  const { title, category_id, dueDate, type, memo } = task;
  const categoryName = getCategoryNameById(category_id, categories);

  return (
    <div className="bg-white rounded-md p-4 shadow-lg w-full flex flex-col">
      <div className="flex mb-2 gap-1">
        <TypeBadge type={type} />
        {category_id !== null && <CategoryBadge label={categoryName} />}
      </div>

      <div className="flex items-start mb-2 flex-grow">
        <div className="w-4 h-4 rounded-full border-2 border-[#8d5cf6] mr-2 mt-0.5 flex-shrink-0"></div>
        <div className="text-sm font-medium line-clamp-2">{title}</div>
      </div>

      {memo && (
        <div className="text-xs text-[#6e726e]  mb-2 line-clamp-2">{memo}</div>
      )}

      {dueDate && (
        <div className="text-xs text-[#6e726e] flex items-center mt-auto">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{dueDate}</span>
        </div>
      )}
    </div>
  );
}
