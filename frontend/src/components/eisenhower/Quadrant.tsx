'use client';

import type { Task } from '@/types/task';
import { Droppable } from '@/components/eisenhower/Droppable';
import { TaskCard } from '@/components/eisenhower/card/TaskCard';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface QuadrantProps {
  id: string;
  title: string;
  tasks: Task[];
  layout: 'matrix' | 'board';
  onClickTask?: (task: Task) => void;
}

export function Quadrant({
  id,
  title,
  tasks,
  layout,
  onClickTask,
}: QuadrantProps) {
  return (
    <div className="bg-[#f5f1ff] rounded-lg p-4 h-[50vh]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs mr-2">
            {title[1]} {/* 'Q1' -> '1' 등으로 출력 */}
          </div>
          <h3 className="font-bold text-lg">{title}</h3>
          <span className="text-xs text-gray-500 ml-2">{tasks.length}</span>
        </div>
      </div>

      <Droppable
        id={id}
        className="h-[calc(100%-2rem)] overflow-y-auto pr-1 custom-scrollbar"
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-0 pt-1 pb-1">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onClickTask?.(task)}
                layout={layout}
              />
            ))}
          </div>
        </SortableContext>
      </Droppable>
    </div>
  );
}
