import type { Task, TaskType, Quadrant, ActualTaskType } from '@/types/task';
import { useEffect, useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { CreateTaskForm } from '@/components/eisenhower/CreateTaskForm';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/eisenhower/card/TaskCard';
import { TaskDetailSidebar } from '@/components/eisenhower/TaskDetailSidebar';
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
import { quadrantTitles } from '@/constants/section';
import { useCategoryStore } from '@/store/useCategoryStore';
import { getCategoryNameById } from '@/utils/category';
import { DialogClose } from '@radix-ui/react-dialog';
import { getQuadrantId } from '@/utils/quadrant';

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

  // form 상태: category_id를 사용하도록 변경
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

  // 드래그 앤 드롭 센서
  const sensors = useSensors(useSensor(PointerSensor));

  // 카테고리 스토어
  const { fetchCategories, categories } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories(); // store에 categories 추가
    }
  }, [categories, fetchCategories]);

  // taskId로 어떤 Quadrant(Q1 ~ Q4)에 위치한 작업인지 판별
  const findTaskQuadrant = (taskId: string | number): Quadrant | undefined => {
    if (typeof taskId === 'string' && taskId.startsWith('placeholder-')) {
      return taskId.replace('placeholder-', '') as Quadrant;
    }

    return (['Q1', 'Q2', 'Q3', 'Q4'] as Quadrant[]).find((quadrant) =>
      tasks[quadrant].some((t) => t.id === taskId),
    );
  };

  // 작업카드를 클릭했을 때 상세 사이드바를 열어준다
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsSidebarOpen(true);
  };

  // 드래그 앤 드롭 종료 이벤트
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const fromQuadrant = findTaskQuadrant(active.id);
    const toQuadrant = findTaskQuadrant(over.id);
    if (!fromQuadrant || !toQuadrant) return;

    const activeIndex = tasks[fromQuadrant].findIndex(
      (t) => t.id === active.id,
    );
    const overIndex = tasks[toQuadrant].findIndex((t) => t.id === over.id);
    const movingTask = tasks[fromQuadrant][activeIndex];

    if (fromQuadrant === toQuadrant) {
      const reordered = arrayMove(tasks[fromQuadrant], activeIndex, overIndex);
      onReorderTask(fromQuadrant, reordered);
    } else {
      const newFrom = tasks[fromQuadrant].filter((t) => t.id !== active.id);
      const newTo = [...tasks[toQuadrant]];
      const insertIndex = overIndex >= 0 ? overIndex : newTo.length;
      newTo.splice(insertIndex, 0, { ...movingTask, quadrant: toQuadrant });
      onReorderTask(fromQuadrant, newFrom);
      onReorderTask(toQuadrant, newTo);
    }
  };

  // 뷰모드에 따라 다른 그리드 레이아웃
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
          const quadrant = findTaskQuadrant(active.id);
          const task =
            quadrant && tasks[quadrant]?.find((t) => t.id === active.id);
          if (task) setActiveTask(task);
        }}
      >
        <div className={`grid ${gridClass} gap-4`}>
          {(Object.keys(tasks) as Quadrant[]).map((quadrant) => {
            // 필터 로직에서 category_id 필드를 사용
            const filtered = tasks[quadrant].filter((task) => {
              const matchType =
                selectedType === 'ALL' || task.type === selectedType;
              const matchCategory =
                selectedCategory === 'all' ||
                getCategoryNameById(task.categoryId, categories) ===
                  selectedCategory;
              // dueDate가 "YYYY-MM-DD" 형태이므로, Date 객체로 변환
              const taskDate = new Date(task.dueDate);
              const matchDate = taskDate >= startDate && taskDate <= endDate;
              return matchType && matchCategory && matchDate;
            });

            return (
              <div
                key={quadrant}
                className="space-y-2 h-[400px] min-h-[300px] border rounded-xl p-2 bg-white flex flex-col"
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
                        // quadrant만 변경
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
                                id: Date.now().toString(), // 임시 고유 id 생성 (또는 UUID 사용)
                                title: form.title,
                                // memo: '', 스웨거에 메모 저장 필드가 없음
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
                  items={
                    filtered.length > 0
                      ? filtered.map((task) => task.id as number) // task.id가 반드시 number여야 함을 단언
                      : [getQuadrantId(quadrant)]
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
                      // 드래그 앤 드롭에서 빈 배열 에러 방지를 위한 placeholder 처리
                      <div className="opacity-0 pointer-events-none select-none">
                        <TaskCard
                          task={{
                            id: getQuadrantId(quadrant),
                            title: '',
                            // memo: '',
                            dueDate: '',
                            type: 'TODO',
                            categoryId: 1,
                            quadrant,
                            order: 0,
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
