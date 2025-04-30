import { useEffect, useState } from 'react';
import {
  DndContext,
  rectIntersection,
  DragEndEvent,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { quadrantTitles } from '@/constants/section';
import { getCategoryNameById } from '@/utils/category';
import { useCategoryStore } from '@/store/useCategoryStore';
import { TaskCard } from '@/components/eisenhower/card/TaskCard';
import { AddTask } from '@/components/eisenhower/AddTask';
import { DragOverlayCard } from '@/components/eisenhower/card/DragOverlayCard';
import type { Task } from '@/types/task';
import { Quadrant, TaskType } from '@/types/commonTypes';

interface PriorityViewProps {
  tasks: Record<Quadrant, Task[]>;
  selectedType: TaskType;
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onReorderTask: (quadrant: Quadrant, newTasks: Task[]) => void;
  onCreateTask: (task: Task) => void;
  onTaskClick: (task: Task) => void;
  viewMode: 'matrix' | 'board';
}

function Droppable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="h-full w-full">
      {children}
    </div>
  );
}

export function PriorityView({
  tasks,
  selectedType,
  selectedCategory,
  startDate,
  endDate,
  onReorderTask,
  onCreateTask,
  onTaskClick,
  viewMode,
}: PriorityViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const { fetchCategories, categories } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, [categories, fetchCategories]);

  const findTaskQuadrant = (taskId: string | number): Quadrant | undefined =>
    (['Q1', 'Q2', 'Q3', 'Q4'] as Quadrant[]).find((q) =>
      tasks[q].some((t) => String(t.id) === String(taskId)),
    );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const from = findTaskQuadrant(active.id);
    const to = findTaskQuadrant(over.id) || (over.id as Quadrant);
    if (!from || !to) return;

    const fromIndex = tasks[from].findIndex(
      (t) => String(t.id) === String(active.id),
    );
    const toIndex = tasks[to].findIndex(
      (t) => String(t.id) === String(over.id),
    );
    const moving = tasks[from][fromIndex];

    if (from === to) {
      onReorderTask(from, arrayMove(tasks[from], fromIndex, toIndex));
    } else {
      const newFrom = tasks[from].filter(
        (t) => String(t.id) !== String(active.id),
      );
      const newTo = [...tasks[to]];
      newTo.splice(toIndex >= 0 ? toIndex : newTo.length, 0, {
        ...moving,
        quadrant: to,
      });
      onReorderTask(from, newFrom);
      onReorderTask(to, newTo);
    }
  };

  const gridClass =
    viewMode === 'board'
      ? 'grid-cols-1 md:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2';

  type ViewMode = 'matrix' | 'board';

  const getQuadrantColors = (viewMode: ViewMode): Record<Quadrant, string> => {
    if (viewMode === 'matrix') {
      return {
        Q1: 'bg-[#F5F1FF] border-gray-300 border rounded-tl-md',
        Q2: 'bg-[#FAF6FF] border-t border-r border-b border-gray-300 rounded-tr-md',
        Q3: 'bg-[#FAF8FD] border-l border-b border-r border-gray-300 rounded-bl-md',
        Q4: 'bg-[#FAFAFA] border-b border-r border-gray-300 rounded-br-md',
      };
    }

    return {
      Q1: 'bg-[#F5F1FF] border border-gray-300 rounded-tl-md rounded-bl-md',
      Q2: 'bg-[#FAF6FF] border-t border-r border-b border-gray-300',
      Q3: 'bg-[#FAF8FD] border-t border-r border-b border-gray-300',
      Q4: 'bg-[#FAFAFA] border-t border-r border-b border-gray-300 rounded-tr-md rounded-br-md',
    };
  };

  const quadrantColors = getQuadrantColors(viewMode);

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => {
        const q = findTaskQuadrant(active.id);
        const t = q && tasks[q].find((t) => String(t.id) === String(active.id));
        if (t) setActiveTask(t);
      }}
    >
      <div className={`grid ${gridClass} h-full`}>
        {(Object.keys(tasks) as Quadrant[]).map((quadrant) => {
          const filtered = tasks[quadrant].filter((task) => {
            if (task.isCompleted) return false;

            const matchType =
              selectedType === 'ALL' || task.type === selectedType;
            const matchCategory =
              selectedCategory === 'all' ||
              getCategoryNameById(task.category_id, categories) ===
                selectedCategory;
            const taskDate = new Date(task.dueDate || '');
            return (
              matchType &&
              matchCategory &&
              taskDate >= startDate &&
              taskDate <= endDate
            );
          });

          return (
            <Droppable key={quadrant} id={quadrant}>
              <div
                className={`px-4 py-5 ${
                  viewMode === 'board'
                    ? 'h-full h-screen'
                    : 'min-h-[400px] h-full'
                } min-h-[300px] flex flex-col ${quadrantColors[quadrant]}`}
              >
                <div className="flex justify-between items-center pb-[14px]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full border border-black text-sm font-semibold leading-none">
                      {quadrant.replace('Q', '')}
                    </div>

                    <div
                      className={`${viewMode === 'board' ? 'text-[16px]' : 'text-xl'} font-semibold`}
                    >
                      {quadrantTitles[quadrant]}
                    </div>
                    <div className="text-sm text-[#6E726E]">
                      {filtered.length}
                    </div>
                  </div>

                  <AddTask
                    quadrant={quadrant}
                    categoryOptions={categories.map((c) => ({
                      id: c.id,
                      title: c.title,
                      bgColor: c.color,
                      textColor: c.textColor,
                    }))}
                    onCreateTask={onCreateTask}
                  />
                </div>

                <SortableContext
                  items={filtered.map((task) => String(task.id))}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 flex-1 overflow-y-auto h-full scrollbar-hide">
                    {filtered.map((task) => (
                      <TaskCard
                        key={String(task.id)}
                        task={{ ...task, id: task.id }}
                        onClick={() => onTaskClick(task)}
                        layout={viewMode}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </Droppable>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask && (
          <DragOverlayCard task={activeTask} categories={categories} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
