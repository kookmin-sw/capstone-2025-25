import { Calendar } from 'lucide-react';
import type { Category } from '@/types/category';
import { getCategoryNameById } from '@/utils/category';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { ActualTaskType, Quadrant, TaskType } from '@/types/task.ts';

export interface DragOverlayCardProps {
  title: string;
  categoryId: number | null;
  dueDate: string;
  type: ActualTaskType | TaskType;
  order: number;
  memo: string;
  categories: Category[]; // Category 타입이 정의되어 있어야 합니다.
  quadrant: Quadrant; // 추가
}

export function DragOverlayCard({
  title,
  memo,
  dueDate,
  type,
  categoryId,
  categories,
}: DragOverlayCardProps) {
  const categoryName = getCategoryNameById(categoryId, categories);

  return (
    <div className="bg-white rounded-md p-4 shadow-lg w-full flex flex-col">
      <div className="flex mb-2 gap-1">
        <TypeBadge type={type} />
        {categoryId !== null && <CategoryBadge label={categoryName} />}
      </div>

      <div className="flex items-start mb-2 flex-grow">
        <div className="w-4 h-4 rounded-full border-2 border-[#8d5cf6] mr-2 mt-0.5 flex-shrink-0"></div>
        <div className="text-sm font-medium line-clamp-2">{title}</div>
      </div>

      {memo && (
        <div className="text-xs text-[#6e726e] ml-7 mb-2 line-clamp-2">
          {memo}
        </div>
      )}

      {dueDate && (
        <div className="text-xs text-[#6e726e] ml-7 flex items-center mt-auto">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{dueDate}</span>
        </div>
      )}
    </div>
  );
}
