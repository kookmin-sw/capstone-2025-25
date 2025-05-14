import { useEffect, useState } from 'react';
import { TaskCard } from '../card/TaskCard.tsx';
import { getCategoryNameById } from '@/utils/category';
import { useCategoryStore } from '@/store/useCategoryStore';
import { eisenhowerService } from '@/services/eisenhowerService';
import type { EisenhowerTask } from '@/types/api/eisenhower';
import { Task } from '@/types/task.ts';

interface CompletedScheduleViewProps {
  tasks: Task[];
  selectedCategory: string;
  startDate: Date | null;
  endDate: Date | null;
  onCategoryChange: (category: string) => void;
  onDateChange: (start: Date, end: Date) => void;
  onTaskClick: (task: EisenhowerTask) => void;
}

export function CompletedView({
  selectedCategory,
  startDate,
  endDate,
  onTaskClick,
}: CompletedScheduleViewProps) {
  const { categories, fetchCategories } = useCategoryStore();
  const [tasks, setTasks] = useState<EisenhowerTask[]>([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await eisenhowerService.getList();
        const apiTasks = res.content.content;

        const completedTasks = apiTasks.filter((t) => t.isCompleted);
        console.log(completedTasks);

        setTasks(completedTasks);
      } catch (err) {
        console.error('완료된 일정 불러오기 실패:', err);
      }
    };

    fetchCompletedTasks();
    fetchCategories();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const due = task.dueDate ? new Date(task.dueDate) : null;

    if (due && startDate && endDate) {
      if (due < startDate || due > endDate) return false;
    }

    const categoryName = getCategoryNameById(task.categoryId, categories);
    if (selectedCategory !== 'all' && categoryName !== selectedCategory)
      return false;

    return true;
  });

  const handleUpdateTask = (updatedTask: EisenhowerTask) => {
    setTasks(
      (prev) =>
        updatedTask.isCompleted
          ? prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
          : prev.filter((t) => t.id !== updatedTask.id), // 완료 취소 → 리스트에서 제거
    );
  };

  return (
    <div className="bg-[#E8EFFF] rounded-lg p-4">
      {filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              variant="done"
              categories={categories}
              onUpdateTask={handleUpdateTask}
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
