import { Calendar } from 'lucide-react';
import type { Category } from '@/types/category';
import { getCategoryNameById } from '@/utils/category';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { Task } from '@/types/task.ts';

export interface DragOverlayCardProps {
  task: Task;
  categories: Category[];
}

export function DragOverlayCard({ task, categories }: DragOverlayCardProps) {
  const { title, categoryId, dueDate, memo } = task;
  const categoryName = getCategoryNameById(categoryId, categories);
  const category = categories.find((c) => c.id === categoryId);

  return (
    <div className="bg-white rounded-md p-4 shadow-lg w-full flex flex-col">
      <div className="absolute  top-5 right-5 flex gap-4"></div>
      <div className="flex mb-2 flex-wrap">
        {categoryId !== null && (
          <CategoryBadge
            label={categoryName}
            bgColor={category?.color ?? '#E8EFFF'}
          />
        )}
      </div>

      <div className="flex items-start mb-2 flex-grow">
        <div className="text-md font-medium line-clamp-2">{title}</div>
      </div>

      <div className="text-xs mb-2 line-clamp-2 text-[#858899] ">
        {memo ? memo : <>비어 있음</>}
      </div>
      <div className="text-[14px] flex items-center mt-auto text-[#525463] ">
        {dueDate ? (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-[#525463] " />
            <span className="text-center pt-[1px] text-[14px] text-[#525463] ">
              {dueDate}
              {/*{format(new Date(dueDate), 'yyyy.MM.dd')}*/}
            </span>
          </div>
        ) : (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-[#525463] " />
            <span className="text-center pt-[1px] text-[14px] text-[#525463] ">
              날짜 없음
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
