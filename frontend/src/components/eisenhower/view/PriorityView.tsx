import { useEffect, useState, useRef } from 'react';
import {
  DndContext,
  rectIntersection,
  DragEndEvent,
  useDroppable,
  DragOverlay,
  TouchSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { boardQuadrantTitles, quadrantTitles } from '@/constants/section.tsx';
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
import { useSortable } from '@dnd-kit/sortable';
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import Plus from '@/assets/plus.svg';

const useCustomSensors = () => {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 0,
      // delay: 100,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 0,
      tolerance: 3,
    },
  });

  return useSensors(pointerSensor, touchSensor);
};

function Droppable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        ' w-full h-full',
        isOver && 'border-[1px] rounded-[8px] md:rounded-[16px] border-blue',
      )}
    >
      {children}
    </div>
  );
}

function SortableTaskCard({
  task,
  children,
  onClick,
}: {
  task: any;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { attributes, listeners, setNodeRef } = useSortable({
    id: task.id,
    activationConstraint: {
      distance: 5, // 최소 5px 이상 이동해야 드래그
    },
  });

  const movedRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    startPosRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;

    // 필수: DnD 작동하도록 설정
    listeners.onPointerDown?.(e);
    console.log('[pointer down]', e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startPosRef.current) return;
    const dx = Math.abs(e.clientX - startPosRef.current.x);
    const dy = Math.abs(e.clientY - startPosRef.current.y);
    if (dx > 4 || dy > 4) {
      movedRef.current = true;
    }
    console.log('[pointer move]', e.clientX, e.clientY);
  };

  // const handleClick = (e: React.MouseEvent) => {
  //   if (movedRef.current) {
  //     return;
  //   } else {
  //     onClick?.();
  //   }
  // };

  const handleClick = (e: React.MouseEvent) => {
    onClick?.();
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      style={{ touchAction: 'none' }}
    >
      <div {...listeners}>{children}</div>
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
  startDate: Date | null;
  endDate: Date | null;
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
    setTasksByQuadrant((prev) => {
      const newState: Record<Quadrant, Task[]> = {
        Q1: [],
        Q2: [],
        Q3: [],
        Q4: [],
      };

      for (const q of Object.keys(prev) as Quadrant[]) {
        newState[q] = prev[q].filter((t) => t.id !== updatedTask.id);
      }

      newState[updatedTask.quadrant].push(updatedTask);

      return newState;
    });
  };

  const handleDeleteTask = (deleteTask: Task) => {
    setTasksByQuadrant((prev) => {
      const newState: Record<Quadrant, Task[]> = {
        Q1: [],
        Q2: [],
        Q3: [],
        Q4: [],
      };

      for (const q of Object.keys(prev) as Quadrant[]) {
        newState[q] = prev[q].filter((t) => t.id !== deleteTask.id);
      }

      return newState;
    });
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

  const { isMobile } = useResponsive();
  const [activeQuadrant, setActiveQuadrant] = useState<Quadrant>('Q1');
  const sensors = useCustomSensors();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState();
  const handleTaskModal = (task) => {
    setIsModalOpen(true);
    setSelectedTask(task);
    setModalMode('edit');
  };
  const [modalMode, setModalMode] = useState('create');
  const handleCreateModal = (quadrant) => {
    const task = {
      title: '',
      categoryId: null,
      dueDate: null,
      memo: null,
      quadrant: quadrant,
    };
    setSelectedTask(task);
    setIsModalOpen(true);
    setModalMode('create');
  };

  return (
    <DndContext
      sensors={sensors}
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
      <div
        className={cn(
          `grid ${gridClass} h-full overflow-x-auto scrollbar-hide touch-action-none`,
          viewMode == 'board' && 'flex',
        )}
      >
        {(Object.keys(tasksByQuadrant) as Quadrant[])
          .filter((q) => !isMobile || q === activeQuadrant)
          .map((quadrant) => {
            const filtered = tasksByQuadrant[quadrant].filter((task) => {
              if (task.isCompleted) return false;

              const matchCategory =
                selectedCategory === 'all' ||
                getCategoryNameById(task.categoryId, categories) ===
                  selectedCategory;

              const stripTime = (date: Date) =>
                new Date(date.getFullYear(), date.getMonth(), date.getDate());

              const taskDate = task.dueDate
                ? stripTime(new Date(task.dueDate))
                : null;
              const s = startDate ? stripTime(startDate) : null;
              const e = endDate ? stripTime(endDate) : null;

              if (!taskDate && (s || e)) return false;

              const matchDate =
                s && !e
                  ? taskDate?.getTime() === s.getTime()
                  : !s && e
                    ? taskDate?.getTime() === e.getTime()
                    : s && e
                      ? taskDate &&
                        taskDate.getTime() >= s.getTime() &&
                        taskDate.getTime() <= e.getTime()
                      : true;

              return matchCategory && matchDate;
            });

            return (
              <Droppable key={quadrant} id={quadrant}>
                {isMobile && (
                  <div className={cn('grid gap-2 md:mb-4 grid-cols-1')}>
                    {(['Q1', 'Q2', 'Q3', 'Q4'] as Quadrant[]).map((q) => (
                      <Droppable key={q} id={q}>
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
                      </Droppable>
                    ))}
                  </div>
                )}
                <div
                  className={cn(
                    'px-4 py-5 mt-2 md:mt-0 flex flex-col rounded-[16px] w-full',
                    quadrantColors[quadrant],
                    'h-auto overflow-visible',
                    'md:h-[400px] md:overflow-y-auto md:scrollbar-hide',
                    viewMode === 'board'
                      ? 'md:h-[calc(100vh-160px)] md:min-w-[268px]'
                      : '',
                  )}
                >
                  <div
                    className={cn(
                      'flex justify-between pb-[14px] w-full',
                      viewMode === 'board' ? '' : 'items-center',
                    )}
                  >
                    <div
                      className={cn(
                        'flex gap-2 w-full justify-between',
                        viewMode === 'board' ? '' : 'items-center',
                      )}
                    >
                      <div className="flex gap-1">
                        <div className="w-6 h-6 flex items-center justify-center rounded-[8px] text-sm font-semibold leading-none bg-blue text-neon-green shrink-0">
                          {quadrant.replace('Q', '')}
                        </div>

                        <div
                          className={cn(
                            'flex justify-between gap-4 w-full',
                            viewMode === 'board' ? '' : 'items-center',
                          )}
                        >
                          <div
                            className={cn(
                              'font-semibold text-[#525463]',
                              viewMode === 'board'
                                ? 'text-[16px]'
                                : 'text-[20px]',
                            )}
                          >
                            {viewMode === 'board'
                              ? boardQuadrantTitles[quadrant]
                              : quadrantTitles[quadrant]}
                          </div>
                          <div className="text-sm text-[#6E726E]">
                            {filtered.length}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCreateModal(quadrant)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue shrink-0 cursor-pointer"
                      >
                        <img
                          src={Plus}
                          alt="plus"
                          className="w-[18px] h-[18px]"
                        />
                      </button>
                    </div>
                  </div>
                  <SortableContext
                    items={filtered.map((task) => String(task.id))}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 flex-1 overflow-y-auto scrollbar-hide">
                      {filtered.map((task) => (
                        <SortableTaskCard
                          task={task}
                          key={String(task.id)}
                          onClick={() => {
                            handleTaskModal(task);
                          }}
                        >
                          <TaskCard
                            onUpdateTask={handleUpdateTask}
                            task={task}
                            layout={viewMode}
                            categories={categories}
                          />
                        </SortableTaskCard>
                      ))}
                    </div>
                  </SortableContext>
                </div>
              </Droppable>
            );
          })}
      </div>
      <TaskModal
        mode={modalMode}
        task={selectedTask}
        isOpen={isModalOpen}
        onOpenChange={() => {
          setIsModalOpen(false);
        }}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      <DragOverlay>
        {activeTask && (
          <DragOverlayCard task={activeTask} categories={categories} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
