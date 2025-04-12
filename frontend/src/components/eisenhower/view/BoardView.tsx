'use client';

import { Quadrant } from '@/components/eisenhower/Quadrant';
import type { Task } from '@/types/task';

type BoardViewProps = {
  tasks: {
    section1: Task[];
    section2: Task[];
    section3: Task[];
    section4: Task[];
  };
  onTaskClick: (task: Task) => void;
};

export function BoardView({ tasks, onTaskClick }: BoardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Quadrant
        id="section1"
        title="Q1 긴급하고 중요한 일"
        tasks={tasks.section1}
        layout="board"
        onClickTask={onTaskClick}
      />
      <Quadrant
        id="section2"
        title="Q2 긴급하지 않지만 중요한 일"
        tasks={tasks.section2}
        layout="board"
        onClickTask={onTaskClick}
      />
      <Quadrant
        id="section3"
        title="Q3 긴급하지만 중요하지 않은 일"
        tasks={tasks.section3}
        layout="board"
        onClickTask={onTaskClick}
      />
      <Quadrant
        id="section4"
        title="Q4 긴급하지도 중요하지도 않은 일"
        tasks={tasks.section4}
        layout="board"
        onClickTask={onTaskClick}
      />
    </div>
  );
}
