'use client';

import { TaskCard } from '../PriorityMatrix/card/TaskCard';
import type { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function TaskList({ tasks, onTaskClick }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        표시할 작업이 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-[#e5e5e5]">
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
    </div>
  );
}
