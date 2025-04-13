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
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/common/Modal';
import { DialogClose } from '@radix-ui/react-dialog';
import { quadrantTitles } from '@/constants/section';
import { getCategoryNameById } from '@/utils/category';
import { useCategoryStore } from '@/store/useCategoryStore';
import { TaskCard } from '@/components/eisenhower/card/TaskCard';
import { CreateTaskForm } from '@/components/eisenhower/CreateTaskForm';
import { DragOverlayCard } from '@/components/eisenhower/card/DragOverlayCard';
import type { Task, TaskType, Quadrant } from '@/types/task';

interface PriorityViewProps {
  tasks: Record<Quadrant, Task[]>;
  selectedType: TaskType;
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onReorderTask: (quadrant: Quadrant, newTasks: Task[]) => void;
  onCreateTask: (quadrant: Quadrant, task: Task) => void;
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
  const [form, setForm] = useState<Omit<Task, 'id'>>({
    title: '',
    memo: '',
    dueDate: new Date().toISOString().split('T')[0],
    type: 'TODO',
    categoryId: null,
    order: 0,
    quadrant: 'Q1',
  });

  const { fetchCategories, categories } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, [categories]);

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
            const matchType =
              selectedType === 'ALL' || task.type === selectedType;
            const matchCategory =
              selectedCategory === 'all' ||
              getCategoryNameById(task.categoryId, categories) ===
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
                } min-h-[300px] border rounded-xl bg-white flex flex-col`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-semibold">
                    {quadrantTitles[quadrant]}
                  </h2>
                  <Modal
                    title="새로운 작업 추가"
                    description={quadrantTitles[quadrant]}
                    trigger={
                      <Button variant="ghost" size="sm" className="text-xs">
                        + 추가
                      </Button>
                    }
                    children={
                      <CreateTaskForm
                        form={{ ...form, quadrant }}
                        setForm={(partial) =>
                          setForm((prev) => ({ ...prev, ...partial }))
                        }
                        categoryOptions={categories.map((c) => ({
                          id: c.id,
                          name: c.name,
                        }))}
                        onCreateTask={() => {}}
                      />
                    }
                    footer={
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">취소하기</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            onClick={() => {
                              const newTask: Task = {
                                id: Date.now().toString(),
                                title: form.title,
                                memo: form.memo,
                                dueDate: form.dueDate,
                                type: form.type,
                                categoryId: form.categoryId,
                                order: form.order,
                                quadrant: form.quadrant,
                              };
                              onCreateTask(form.quadrant, newTask);
                              setForm({
                                title: '',
                                memo: '',
                                dueDate: new Date().toISOString().split('T')[0],
                                type: 'TODO',
                                categoryId: null,
                                order: 0,
                                quadrant: 'Q1',
                              });
                            }}
                          >
                            생성하기
                          </Button>
                        </DialogClose>
                      </div>
                    }
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
          <DragOverlayCard
            title={activeTask.title}
            memo={activeTask.memo}
            dueDate={activeTask.dueDate ?? ''}
            type={activeTask.type}
            categoryId={activeTask.categoryId}
            order={activeTask.order}
            quadrant={activeTask.quadrant}
            categories={categories}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
