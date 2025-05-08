import type { Task } from '@/types/task.ts';
import { TaskCard } from '../card/TaskCard.tsx';
import { getCategoryNameById } from '@/utils/category';
import { useCategoryStore } from '@/store/useCategoryStore';

interface CompletedScheduleViewProps {
  tasks: Task[];
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onCategoryChange: (category: string) => void;
  onDateChange: (start: Date, end: Date) => void;
  onTaskClick: (task: Task) => void;
}

export function CompletedView({
  tasks,
  selectedCategory,
  onTaskClick,
}: CompletedScheduleViewProps) {
  const { categories } = useCategoryStore();

  const filteredTasks = tasks.filter((task) => {
    const categoryName = getCategoryNameById(task.category_id, categories);
    if (selectedCategory !== 'all' && categoryName !== selectedCategory)
      return false;

    return true;
  });

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      {filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              variant="done"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          완료된 일정이 없습니다.
        </div>
      )}
    </div>
  );
}
