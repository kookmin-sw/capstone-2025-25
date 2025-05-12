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
import { cn } from '@/lib/utils.ts';
import { useResponsive } from '@/hooks/use-mobile.ts';

function Droppable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className=" w-full">
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
      ? 'grid-cols-1 md:grid-cols-4 gap-4'
      : 'grid-cols-1 md:grid-cols-2 gap-4';

  const quadrantColors: Record<Quadrant, string> = {
    Q1: 'bg-[#C2D5FF] border-blue border',
    Q2: 'bg-[#DAE6FF] border-blue border',
    Q3: 'bg-[#E8EFFF] border-blue border',
    Q4: 'bg-[#F1F5FF] border-blue border',
  };

  const { isMobile, isCompact } = useResponsive();
  const [activeQuadrant, setActiveQuadrant] = useState<Quadrant>('Q1');

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
      {isMobile && (
        <div
          className={cn(
            'grid gap-1 mb-4',
            isCompact ? 'grid-cols-1' : 'grid-cols-2',
          )}
        >
          {(['Q1', 'Q2', 'Q3', 'Q4'] as Quadrant[]).map((q) => (
            <button
              key={q}
              onClick={() => setActiveQuadrant(q)}
              className={cn(
                'w-full py-2 px-3 rounded-[8px] text-sm font-medium  border cursor-pointer flex items-center gap-2',
                quadrantColors[q],
                activeQuadrant === q
                  ? 'text-[#525463] border-[#CDCED6]'
                  : 'text-[#525463] border-[#CDCED6]',
              )}
            >
              <div className="w-6 h-6 flex items-center justify-center rounded-[8px] text-sm font-semibold leading-none bg-blue text-neon-green shrink-0">
                {q.replace('Q', '')}
              </div>
              {quadrantTitles[q]}
            </button>
          ))}
        </div>
      )}

      <div className={`grid ${gridClass} h-full h-screen`}>
        {(Object.keys(tasksByQuadrant) as Quadrant[])
          .filter((q) => !isMobile || q === activeQuadrant)
          .map((quadrant) => {
            const filtered = tasksByQuadrant[quadrant].filter((task) => {
              if (task.isCompleted) return false;

              const matchCategory =
                selectedCategory === 'all' ||
                getCategoryNameById(task.categoryId, categories) ===
                  selectedCategory;

              if (!task.dueDate) return matchCategory;

              const taskDate = new Date(task.dueDate);
              return (
                matchCategory && taskDate >= startDate && taskDate <= endDate
              );
            });

            return (
              <Droppable key={quadrant} id={quadrant}>
                <div
                  className={cn(
                    'px-4 py-5 overflow-y-scroll flex flex-col rounded-[16px]',
                    quadrantColors[quadrant],
                    viewMode === 'board' ? 'h-[800px]' : 'h-[400px]',
                  )}
                >
                  <div className="flex justify-between items-center pb-[14px] gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center rounded-[8px] text-sm font-semibold leading-none bg-blue text-neon-green shrink-0">
                        {quadrant.replace('Q', '')}
                      </div>
                      <div
                        className={cn(
                          'font-semibold text-[#525463]',
                          viewMode === 'board' ? 'text-[16px]' : 'text-[20px]',
                        )}
                      >
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
