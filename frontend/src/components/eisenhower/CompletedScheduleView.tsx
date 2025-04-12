'use client';

import type { Task } from '@/types/task';
import { TaskCard } from './card/TaskCard';

interface CompletedScheduleViewProps {
  tasks: Task[];
  selectedType: 'ALL' | 'TODO' | 'THINKING';
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onTypeChange: (type: 'ALL' | 'TODO' | 'THINKING') => void;
  onCategoryChange: (category: string) => void;
  onDateChange: (start: Date, end: Date) => void;
  onTaskClick: (task: Task) => void;
}

export function CompletedScheduleView({
  tasks,
  selectedType,
  selectedCategory,
  onTaskClick,
}: CompletedScheduleViewProps) {
  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    // Filter by type
    if (selectedType !== 'ALL' && task.tags.type !== selectedType) {
      return false;
    }

    // Filter by category
    if (selectedCategory !== 'all' && task.tags.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  return (
    <div className="bg-white rounded-lg p-4 border border-[#e5e5e5]">
      <h3 className="font-bold text-lg mb-3">
        완료된 작업 ({filteredTasks.length})
      </h3>
      {filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
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
