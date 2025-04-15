import type { ActualTaskType, Task, TaskType } from '@/types/task.ts';
import { TaskCard } from '../card/TaskCard.tsx';
import { getCategoryNameById } from '@/utils/category';
import { useCategoryStore } from '@/store/useCategoryStore';

interface CompletedScheduleViewProps {
  tasks: Task[];
  selectedType: ActualTaskType | TaskType;
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onCategoryChange: (category: string) => void;
  onDateChange: (start: Date, end: Date) => void;
  onTaskClick: (task: Task) => void;
}

export function CompletedView({
  tasks,
  selectedType,
  selectedCategory,
  onTaskClick,
}: CompletedScheduleViewProps) {
  const { categories } = useCategoryStore();

  const filteredTasks = tasks.filter((task) => {
    if (selectedType !== 'ALL' && task.type !== selectedType) return false;

    const categoryName = getCategoryNameById(task.category_id, categories);
    if (selectedCategory !== 'all' && categoryName !== selectedCategory)
      return false;

    return true;
  });

  return (
    <div className="bg-white rounded-lg p-4 border border-[#e5e5e5]">
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
          완료된 작업이 없습니다.
        </div>
      )}
    </div>
  );
}
