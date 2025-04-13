import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { CompletedView } from '@/components/eisenhower/view/CompletedView.tsx';
import { TaskDetailSidebar } from '@/components/eisenhower/TaskDetailSidebar';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/eisenhower/FilterBar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DragOverlayCard } from '@/components/eisenhower/card/DragOverlayCard';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useTaskDnD } from '@/hooks/useTaskDnD';
import { useCategoryStore } from '@/store/useCategoryStore';
import { Toaster, toast } from 'sonner';
import type { Task, TaskDetail } from '@/types/task';
import { PriorityView } from '@/components/eisenhower/view/PriorityView';
import {
  initialTasks,
  completedTasks,
} from '@/components/eisenhower/data/tasks';

function convertToTaskDetail(task: Task): TaskDetail {
  return {
    ...task,
    isCompleted: false,
    createdAt: '',
    mindMapId: null,
    pomodoroId: null,
  };
}

export default function MatrixPage() {
  const {
    selectedType,
    selectedCategory,
    startDate,
    endDate,
    setSelectedType,
    setSelectedCategory,
    setDateRange,
  } = useTaskFilters();

  const [view, setView] = useState<'matrix' | 'board'>('matrix');
  const [activeTab, setActiveTab] = useState<'all' | 'completed'>('all');
  const [tasks, setTasks] = useState<Record<string, Task[]>>(initialTasks);
  const [doneTasks, setDoneTasks] =
    useState<Record<string, Task[]>>(completedTasks);

  const [selectedTask, setSelectedTask] = useState<TaskDetail | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { categories, addCategory, removeCategory } = useCategoryStore();
  const { activeTask, sensors, handleDragStart, handleDragEnd } = useTaskDnD({
    tasks,
    setTasks,
  });

  const handleTaskClick = (task: TaskDetail) => {
    setSelectedTask(task);
    setIsSidebarOpen(true);
  };

  const handleTaskSave = (updatedTask: TaskDetail) => {
    const sectionId = updatedTask.quadrant as keyof typeof tasks;
    const safeTask: Task = {
      ...updatedTask,
      dueDate: updatedTask.dueDate ?? '',
    };

    setTasks((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((t) =>
        t.id === safeTask.id ? safeTask : t,
      ),
    }));

    setDoneTasks((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((t) =>
        t.id === safeTask.id ? safeTask : t,
      ),
    }));

    setSelectedTask(updatedTask);
    toast.success('작업이 저장되었습니다.');
  };

  const handleTaskDelete = (taskId: string | number) => {
    setTasks((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, taskList]) => [
          key,
          taskList.filter((task) => task.id !== taskId),
        ]),
      ),
    );
    setIsSidebarOpen(false);
    toast.success('작업이 삭제되었습니다.');
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col p-4 md:p-6 h-screen">
        <Toaster richColors position="top-center" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">아이젠하워 매트릭스</h1>
          <div className="flex gap-2">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as 'all' | 'completed')}
            >
              <TabsList>
                <TabsTrigger value="all">모든 일정</TabsTrigger>
                <TabsTrigger value="completed">완료된 일정</TabsTrigger>
              </TabsList>
            </Tabs>
            {activeTab === 'all' && (
              <Button
                variant="outline"
                onClick={() => setView(view === 'matrix' ? 'board' : 'matrix')}
              >
                {view === 'matrix' ? '보드 뷰로 전환' : '매트릭스 뷰로 전환'}
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <FilterBar
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            startDate={startDate}
            endDate={endDate}
            onTypeChange={setSelectedType}
            onCategoryChange={setSelectedCategory}
            onDateChange={setDateRange}
          />
        </div>

        {activeTab === 'all' ? (
          <PriorityView
            tasks={tasks}
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            startDate={startDate}
            endDate={endDate}
            viewMode={view}
            onTaskClick={(task) => handleTaskClick(convertToTaskDetail(task))}
            onReorderTask={(sectionId, newTasks) =>
              setTasks((prev) => ({ ...prev, [sectionId]: newTasks }))
            }
            onCreateTask={(sectionId, newTask) =>
              setTasks((prev) => ({
                ...prev,
                [sectionId]: [...prev[sectionId], newTask],
              }))
            }
          />
        ) : (
          <CompletedView
            tasks={Object.values(doneTasks).flat()}
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            startDate={startDate}
            endDate={endDate}
            onTaskClick={(task) => handleTaskClick(convertToTaskDetail(task))}
            onCategoryChange={setSelectedCategory}
            onDateChange={setDateRange}
          />
        )}

        <TaskDetailSidebar
          task={selectedTask}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSave={handleTaskSave}
          onDelete={handleTaskDelete}
          categories={categories}
          onAddCategory={addCategory}
          onDeleteCategory={(name) => {
            const category = categories.find((c) => c.name === name);
            if (category) removeCategory(category.id);
          }}
        />

        <DragOverlay>
          {activeTask && (
            <DragOverlayCard
              title={activeTask.title}
              categoryId={activeTask.categoryId}
              dueDate={activeTask.dueDate}
              quadrant={activeTask.quadrant}
              type={activeTask.type}
              order={activeTask.order}
              categories={categories}
              memo={activeTask.memo}
            />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
