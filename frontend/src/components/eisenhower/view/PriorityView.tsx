import type { Task, TaskType, SectionId } from '@/types/task.ts';
import { useState } from 'react';
import { Modal } from '@/components/common/Modal.tsx';
import { CreateTaskForm } from '@/components/eisenhower/modal/CreateTaskForm.tsx';
import { DialogClose } from '@/components/ui/Dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { TaskCard } from '@/components/eisenhower/card/TaskCard.tsx';
import { TaskDetailSidebar } from '@/components/eisenhower/TaskDetailSidebar.tsx';
import {
  DndContext,
  closestCorners,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { SECTION_IDS, SECTION_TITLES } from '@/constants/eisenhower.ts';
import { useCategoryStore } from '@/store/useCategoryStore.ts';

interface PriorityViewProps {
  tasks: Record<SectionId, Task[]>;
  selectedType: TaskType;
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onTaskClick: (task: Task) => void;
  onReorderTask: (sectionId: SectionId, newTasks: Task[]) => void;
  onCreateTask: (sectionId: SectionId, task: Task) => void;
  viewMode: 'matrix' | 'board';
}

export function PriorityView({
  tasks,
  selectedType,
  selectedCategory,
  startDate,
  endDate,
  onTaskClick,
  onReorderTask,
  onCreateTask,
  viewMode,
}: PriorityViewProps) {
  const [taskForm, setTaskForm] = useState<Omit<Task, 'id'>>({
    title: '',
    memo: '',
    date: '',
    tags: { type: 'TODO', category: undefined },
    section: '',
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { categories } = useCategoryStore();
  const sensors = useSensors(useSensor(PointerSensor));

  const findTaskSection = (taskId: string): SectionId | undefined => {
    if (taskId.startsWith('placeholder-')) {
      return taskId.replace('placeholder-', '') as SectionId;
    }
    return SECTION_IDS.find((sectionId) =>
      tasks[sectionId].some((t) => t.id === taskId),
    );
  };

  const handleTaskClick = (task: Task) => {
    console.log('TaskCard 클릭됨:', task); // 디버깅 로그
    setSelectedTask(task);
    setIsSidebarOpen(true);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const fromSection = findTaskSection(active.id);
    const toSection = findTaskSection(over.id);

    if (!fromSection || !toSection) return;

    const activeIndex = tasks[fromSection].findIndex((t) => t.id === active.id);
    const overIndex = tasks[toSection].findIndex((t) => t.id === over.id);

    const movingTask = tasks[fromSection][activeIndex];

    if (fromSection === toSection) {
      const reordered = arrayMove(tasks[fromSection], activeIndex, overIndex);
      onReorderTask(fromSection, reordered);
    } else {
      const newFrom = tasks[fromSection].filter((t) => t.id !== active.id);
      const newTo = [...tasks[toSection]];
      const insertIndex = overIndex >= 0 ? overIndex : newTo.length;
      newTo.splice(insertIndex, 0, { ...movingTask, section: toSection });

      onReorderTask(fromSection, newFrom);
      onReorderTask(toSection, newTo);
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
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
        onDragStart={({ active }) => {
          const section = findTaskSection(active.id);
          const task =
            section && tasks[section]?.find((t) => t.id === active.id);
          if (task) setActiveTask(task);
        }}
      >
        <div className={`grid ${gridClass} gap-4`}>
          {SECTION_IDS.map((sectionId) => {
            const filtered = tasks[sectionId].filter((task) => {
              const matchType =
                selectedType === 'ALL' || task.tags.type === selectedType;
              const matchCategory =
                selectedCategory === 'all' ||
                task.tags.category === selectedCategory;
              const taskDate = new Date(task.date);
              const matchDate = taskDate >= startDate && taskDate <= endDate;
              return matchType && matchCategory && matchDate;
            });

            return (
              <div
                key={sectionId}
                className="space-y-2 h-[400px] min-h-[300px] border rounded-xl p-2 bg-white flex flex-col"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-semibold">
                    {SECTION_TITLES[sectionId]}
                  </h2>
                  <Modal
                    title="새로운 작업 추가"
                    description={SECTION_TITLES[sectionId]}
                    trigger={
                      <Button variant="ghost" size="sm" className="text-xs">
                        + 추가
                      </Button>
                    }
                    children={
                      <CreateTaskForm
                        sectionId={sectionId}
                        form={taskForm}
                        setForm={(partial) =>
                          setTaskForm((prev) => ({ ...prev, ...partial }))
                        }
                        onCreateTask={(taskData) => {
                          const newTask = {
                            id: `task-${Date.now()}`,
                            ...taskData,
                            section: sectionId,
                          };
                          onCreateTask(sectionId, newTask);
                        }}
                        categoryOptions={categories}
                      />
                    }
                    footer={
                      <div className="w-full flex items-center justify-between">
                        <DialogClose asChild>
                          <Button className="px-8" variant="white">
                            취소하기
                          </Button>
                        </DialogClose>
                        <DialogClose>
                          <Button
                            className="px-8"
                            onClick={() => {
                              if (!taskForm.title.trim()) return;
                              const newTask = {
                                id: `task-${Date.now()}`,
                                ...taskForm,
                                section: sectionId,
                              };
                              onCreateTask(sectionId, newTask);
                              setTaskForm({
                                title: '',
                                memo: '',
                                date: '',
                                tags: { type: 'TODO', category: undefined },
                                section: '',
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
                  items={
                    filtered.length > 0
                      ? filtered.map((task) => task.id)
                      : [`placeholder-${sectionId}`]
                  }
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px] pr-1">
                    {filtered.length > 0 ? (
                      filtered.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onClick={() => handleTaskClick(task)}
                        />
                      ))
                    ) : (
                      <div className="opacity-0 pointer-events-none select-none">
                        <TaskCard
                          task={{
                            id: `placeholder-${sectionId}`,
                            title: '',
                            memo: '',
                            date: '',
                            tags: { type: 'TODO', category: '' },
                            section: sectionId,
                          }}
                          layout={viewMode}
                          onClick={() => {}}
                        />
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} layout={viewMode} />}
        </DragOverlay>
      </DndContext>

      <TaskDetailSidebar
        task={selectedTask}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSave={(updatedTask) => {
          console.log('저장됨:', updatedTask);
          setIsSidebarOpen(false);
        }}
      />
    </div>
  );
}
