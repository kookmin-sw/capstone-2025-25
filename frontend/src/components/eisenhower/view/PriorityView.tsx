import { JSX, useEffect, useState } from 'react';
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
import type { Task, TaskType, Quadrant } from '@/types/task';

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

  const quadrantIcons: Record<Quadrant, JSX.Element> = {
    Q1: (
      <div className="w-6 h-6 rounded-full border border-black text-xs font-bold flex items-center justify-center">
        1
      </div>
    ),
    Q2: (
      <div className="w-6 h-6 rounded-full border border-black text-xs font-bold flex items-center justify-center">
        2
      </div>
    ),
    Q3: (
      <div className="w-6 h-6 rounded-full border border-black text-xs font-bold flex items-center justify-center">
        3
      </div>
    ),
    Q4: (
      <div className="w-6 h-6 rounded-full border border-black  text-xs font-bold flex items-center justify-center">
        4
      </div>
    ),
  };

  const quadrantColors: Record<Quadrant, string> = {
    Q1: 'bg-[#F5F1FF]',
    Q2: 'bg-[#FAF6FF]',
    Q3: 'bg-[#FAF8FD]',
    Q4: 'bg-[#FAFAFA]',
  };

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
      <div className={`grid ${gridClass} gap-2 h-full`}>
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
                className={`p-4 ${
                  viewMode === 'board' ? 'h-full' : 'h-[400px]'
                } min-h-[300px] border flex flex-col ${quadrantColors[quadrant]}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <h2 className="font-semibold flex items-center gap-2">
                      {quadrantIcons[quadrant]}
                      {quadrantTitles[quadrant]}
                    </h2>
                    <div>{filtered.length}</div>
                  </div>

                  <AddTask
                    quadrant={quadrant}
                    categoryOptions={categories.map((c) => ({
                      id: c.id,
                      name: c.name,
                    }))}
                    onCreateTask={onCreateTask}
                  />
                </div>

                <SortableContext
                  items={filtered.map((task) => String(task.id))}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 flex-1 overflow-y-auto h-full pr-1">
                    {filtered.map((task) => (
                      <TaskCard
                        key={String(task.id)}
                        task={{ ...task, id: String(task.id) }}
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
