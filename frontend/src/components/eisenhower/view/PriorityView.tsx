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
import { DragOverlayCard } from '@/components/eisenhower/card/DragOverlayCard';
import type { Task } from '@/types/task';
import { Quadrant } from '@/types/commonTypes';
import { TaskModal } from '@/components/eisenhower/TaskModal';
import { eisenhowerService } from '@/services/eisenhowerService';

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
  selectedCategory,
  startDate,
  endDate,
  viewMode,
}: {
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  viewMode: 'matrix' | 'board';
}) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { fetchCategories, categories } = useCategoryStore();

  const [tasksByQuadrant, setTasksByQuadrant] = useState<
    Record<Quadrant, Task[]>
  >({
    Q1: [],
    Q2: [],
    Q3: [],
    Q4: [],
  });

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await eisenhowerService.getList();
        const allTasks = res.content.content;
        const grouped: Record<Quadrant, Task[]> = {
          Q1: [],
          Q2: [],
          Q3: [],
          Q4: [],
        };
        allTasks.forEach((task) => grouped[task.quadrant].push(task));
        setTasksByQuadrant(grouped);
      } catch (err) {
        console.error('작업 목록 불러오기 실패:', err);
      }
    };
    loadTasks();
  }, []);

  const findTaskQuadrant = (taskId: string | number): Quadrant | undefined =>
    (['Q1', 'Q2', 'Q3', 'Q4'] as Quadrant[]).find((q) =>
      tasksByQuadrant[q].some((t) => String(t.id) === String(taskId)),
    );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const from = findTaskQuadrant(active.id);
    const to = findTaskQuadrant(over.id) || (over.id as Quadrant);
    if (!from || !to) return;

    const fromIndex = tasksByQuadrant[from].findIndex(
      (t) => String(t.id) === String(active.id),
    );
    const toIndex = tasksByQuadrant[to].findIndex(
      (t) => String(t.id) === String(over.id),
    );
    const moving = tasksByQuadrant[from][fromIndex];

    let newTasksByQuadrant = { ...tasksByQuadrant };

    if (from === to) {
      const reordered = arrayMove(newTasksByQuadrant[from], fromIndex, toIndex);
      newTasksByQuadrant = { ...newTasksByQuadrant, [from]: reordered };
    } else {
      const newFrom = newTasksByQuadrant[from].filter(
        (t) => String(t.id) !== String(active.id),
      );
      const newTo = [...newTasksByQuadrant[to]];
      newTo.splice(toIndex >= 0 ? toIndex : newTo.length, 0, {
        ...moving,
        quadrant: to,
      });
      newTasksByQuadrant = {
        ...newTasksByQuadrant,
        [from]: newFrom,
        [to]: newTo,
      };
    }

    setTasksByQuadrant(newTasksByQuadrant);

    const items = Object.entries(newTasksByQuadrant).flatMap(
      ([quadrant, tasks]) =>
        tasks.map((task, index) => ({
          eisenhowerItemId: task.id,
          quadrant,
          order: index + 1,
        })),
    );

    eisenhowerService
      .updateOrder(items)
      .then(() => console.log('순서 및 사분면 업데이트 완료'))
      .catch((err) => console.error('순서 및 사분면 업데이트 실패:', err));
  };

  const handleCreateTask = (newTask: Task) => {
    setTasksByQuadrant((prev) => ({
      ...prev,
      [newTask.quadrant]: [...prev[newTask.quadrant], newTask],
    }));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasksByQuadrant((prev) => ({
      ...prev,
      [updatedTask.quadrant]: prev[updatedTask.quadrant].map((t) =>
        t.id === updatedTask.id ? updatedTask : t,
      ),
    }));
  };

  const gridClass =
    viewMode === 'board'
      ? 'grid-cols-1 md:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2';

  const quadrantColors: Record<Quadrant, string> = {
    Q1: 'bg-[#F5F1FF] border-gray-300 border rounded-tl-md',
    Q2: 'bg-[#FAF6FF] border-t border-r border-b border-gray-300 rounded-tr-md',
    Q3: 'bg-[#FAF8FD] border-l border-b border-r border-gray-300 rounded-bl-md',
    Q4: 'bg-[#FAFAFA] border-b border-r border-gray-300 rounded-br-md',
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => {
        const q = findTaskQuadrant(active.id);
        const t =
          q &&
          tasksByQuadrant[q].find((t) => String(t.id) === String(active.id));
        if (t) setActiveTask(t);
      }}
    >
      <div className={`grid ${gridClass} h-full`}>
        {(Object.keys(tasksByQuadrant) as Quadrant[]).map((quadrant) => {
          const filtered = tasksByQuadrant[quadrant].filter((task) => {
            if (task.isCompleted) return false;
            const matchCategory =
              selectedCategory === 'all' ||
              getCategoryNameById(task.categoryId, categories) ===
                selectedCategory;
            const taskDate = new Date(task.dueDate || '');
            return (
              matchCategory && taskDate >= startDate && taskDate <= endDate
            );
          });

          return (
            <Droppable key={quadrant} id={quadrant}>
              <div
                className={`px-4 py-5 min-h-[400px] flex flex-col ${quadrantColors[quadrant]}`}
              >
                <div className="flex justify-between items-center pb-[14px]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full border border-black text-sm font-semibold leading-none">
                      {quadrant.replace('Q', '')}
                    </div>
                    <div className="text-xl font-semibold">
                      {quadrantTitles[quadrant]}
                    </div>
                    <div className="text-sm text-[#6E726E]">
                      {filtered.length}
                    </div>
                  </div>
                  <TaskModal
                    mode="create"
                    quadrant={quadrant}
                    onCreateTask={handleCreateTask}
                  />
                </div>
                <SortableContext
                  items={filtered.map((task) => String(task.id))}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
                    {filtered.map((task) => (
                      <TaskModal
                        key={task.id}
                        mode="edit"
                        quadrant={task.quadrant}
                        task={task}
                        onUpdateTask={handleUpdateTask}
                        trigger={
                          <div>
                            <TaskCard
                              key={String(task.id)}
                              task={task}
                              layout={viewMode}
                              onUpdateTask={handleUpdateTask}
                              categories={categories}
                            />
                          </div>
                        }
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
