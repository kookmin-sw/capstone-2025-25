import type { Task, TaskType, Quadrant, ActualTaskType } from '@/types/task';
import { useEffect, useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { CreateTaskForm } from '@/components/eisenhower/CreateTaskForm';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/eisenhower/card/TaskCard';
import { TaskDetailSidebar } from '@/components/eisenhower/TaskDetailSidebar';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  rectIntersection,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { quadrantTitles } from '@/constants/section';
import { useCategoryStore } from '@/store/useCategoryStore';
import { getCategoryNameById } from '@/utils/category';
import { DialogClose } from '@radix-ui/react-dialog';

interface PriorityViewProps {
  tasks: Record<Quadrant, Task[]>;
  selectedType: TaskType;
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onReorderTask: (quadrant: Quadrant, newTasks: Task[]) => void;
  onCreateTask: (quadrant: Quadrant, task: Task) => void;
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
  viewMode,
}: PriorityViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [form, setForm] = useState<{
    title: string;
    memo: string;
    dueDate: Date;
    type: ActualTaskType;
    categoryId: number | null;
    order: number;
    quadrant: Quadrant;
  }>({
    title: '',
    memo: '',
    dueDate: new Date(),
    type: 'TODO',
    categoryId: null,
    order: 0,
    quadrant: 'Q1',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  const { fetchCategories, categories } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);

  const findTaskQuadrant = (taskId: string | number): Quadrant | undefined => {
    return (['Q1', 'Q2', 'Q3', 'Q4'] as Quadrant[]).find((quadrant) =>
      tasks[quadrant].some((t) => String(t.id) === String(taskId)),
    );
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsSidebarOpen(true);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const fromQuadrant = findTaskQuadrant(active.id);
    const toQuadrant = findTaskQuadrant(over.id) || (over.id as Quadrant);

    if (!fromQuadrant || !toQuadrant) return;

    const activeIndex = tasks[fromQuadrant].findIndex(
      (t) => String(t.id) === String(active.id),
    );
    const overIndex = tasks[toQuadrant].findIndex(
      (t) => String(t.id) === String(over.id),
    );
    const movingTask = tasks[fromQuadrant][activeIndex];

    if (fromQuadrant === toQuadrant) {
      const reordered = arrayMove(tasks[fromQuadrant], activeIndex, overIndex);
      onReorderTask(fromQuadrant, reordered);
    } else {
      const newFrom = tasks[fromQuadrant].filter(
        (t) => String(t.id) !== String(active.id),
      );
      const newTo = [...tasks[toQuadrant]];
      const insertIndex = overIndex >= 0 ? overIndex : newTo.length;
      newTo.splice(insertIndex, 0, { ...movingTask, quadrant: toQuadrant });
      onReorderTask(fromQuadrant, newFrom);
      onReorderTask(toQuadrant, newTo);
    }
  };

  const gridClass =
    viewMode === 'board'
      ? 'grid-cols-1 md:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2';

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => {
          const quadrant = findTaskQuadrant(active.id);
          const task =
            quadrant &&
            tasks[quadrant]?.find((t) => String(t.id) === String(active.id));
          if (task) setActiveTask(task);
        }}
      >
        <div className={`grid ${gridClass} gap-4`}>
          {(Object.keys(tasks) as Quadrant[]).map((quadrant) => {
            const filtered = tasks[quadrant].filter((task) => {
              const matchType =
                selectedType === 'ALL' || task.type === selectedType;
              const matchCategory =
                selectedCategory === 'all' ||
                getCategoryNameById(task.categoryId, categories) ===
                  selectedCategory;
              const taskDate = new Date(task.dueDate);
              const matchDate = taskDate >= startDate && taskDate <= endDate;
              return matchType && matchCategory && matchDate;
            });

            return (
              <Droppable key={quadrant} id={quadrant}>
                <div className="space-y-2 h-[400px] min-h-[300px] border rounded-xl p-2 bg-white flex flex-col">
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
                                  dueDate: form.dueDate
                                    .toISOString()
                                    .split('T')[0],
                                  type: form.type,
                                  categoryId: form.categoryId,
                                  quadrant: form.quadrant,
                                  order: form.order,
                                };
                                onCreateTask(form.quadrant, newTask);
                                setForm({
                                  title: '',
                                  memo: '',
                                  dueDate: new Date(),
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
                    <div className="space-y-2 flex-1 overflow-y-auto h-[400px] pr-1">
                      {filtered.map((task) => (
                        <TaskCard
                          key={String(task.id)}
                          task={{ ...task, id: String(task.id) }}
                          onClick={() => handleTaskClick(task)}
                          layout={viewMode}
                          dragHandle="full"
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
            <TaskCard task={activeTask} onClick={() => {}} layout={viewMode} />
          )}
        </DragOverlay>
      </DndContext>

      <TaskDetailSidebar
        task={selectedTask}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSave={(updatedTask) => {
          setIsSidebarOpen(false);
          if (!updatedTask.quadrant) return;

          onReorderTask(
            updatedTask.quadrant,
            tasks[updatedTask.quadrant].map((t) =>
              t.id === updatedTask.id ? updatedTask : t,
            ),
          );
        }}
      />
    </div>
  );
}
