import { FilterBar } from '@/components/PriorityMatrix/FilterBar';
import type { Task } from '@/types/task';
import { TaskCard } from '../PriorityMatrix/card/TaskCard';

interface CompletedScheduleViewProps {
  tasks: Task[];
  selectedType: 'all' | 'Todo' | 'Thinking';
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onTypeChange: (type: 'all' | 'Todo' | 'Thinking') => void;
  onCategoryChange: (category: string) => void;
  onDateChange: (start: Date, end: Date) => void;
  onTaskClick: (task: Task) => void;
}

export function CompletedScheduleView({
  tasks,
  selectedType,
  selectedCategory,
  startDate,
  endDate,
  onTypeChange,
  onCategoryChange,
  onDateChange,
  onTaskClick,
}: CompletedScheduleViewProps) {
  return (
    <div className="space-y-4">
      <FilterBar
        selectedType={selectedType}
        selectedCategory={selectedCategory}
        startDate={startDate}
        endDate={endDate}
        onTypeChange={onTypeChange}
        onCategoryChange={onCategoryChange}
        onDateChange={onDateChange}
      />

      <div className="bg-white rounded-lg p-4 border border-[#e5e5e5]">
        <h3 className="font-bold text-lg mb-3">완료된 작업</h3>
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
    </div>
  );
}
