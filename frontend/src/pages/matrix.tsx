import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { CompletedScheduleView } from '@/components/eisenhower/view/CompletedScheduleView';
import { TaskDetailSidebar } from '@/components/eisenhower/TaskDetailSidebar';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/eisenhower/FilterBar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DragOverlayCard } from '@/components/eisenhower/card/DragOverlayCard';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useTaskDnD } from '@/hooks/useTaskDnD';
import type { Task } from '@/types/task';
import { PriorityView } from '@/components/eisenhower/view/PriorityView';
import {
  initialTasks,
  completedTasks,
} from '@/components/eisenhower/data/tasks';

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
  const [tasks, setTasks] = useState(initialTasks);
  const [doneTasks, setDoneTasks] = useState(completedTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([
    'category',
    'work',
    'personal',
    'study',
    'health',
    'dev',
    'marketing',
  ]);

  const { activeTask, sensors, handleDragStart, handleDragEnd } = useTaskDnD({
    tasks,
    setTasks,
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsSidebarOpen(true);
  };

  const handleTaskSave = (updatedTask: Task) => {
    const sectionId = updatedTask.quadrant as keyof typeof tasks;
    setTasks((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].map((t) =>
        t.id === updatedTask.id ? updatedTask : t,
      ),
    }));
    setSelectedTask(updatedTask);
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => {
      const updated = { ...prev };
      for (const section in updated) {
        updated[section as keyof typeof updated] = updated[
          section as keyof typeof updated
        ].filter((task) => task.id !== taskId);
      }
      return updated;
    });
    setIsSidebarOpen(false);
  };

  const handleAddCategory = (newCategory: string) => {
    if (!categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCategories((prev) => prev.filter((cat) => cat !== categoryToDelete));
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">우선순위 매트릭스</h1>
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
            onTaskClick={handleTaskClick}
            onReorderTask={(sectionId, newTasks) =>
              setTasks((prev) => ({ ...prev, [sectionId]: newTasks }))
            }
            onCreateTask={(sectionId, newTask) =>
              setTasks((prev) => ({
                ...prev,
                [sectionId]: [...prev[sectionId], newTask],
              }))
            }
            viewMode={view}
          />
        ) : (
          <CompletedScheduleView
            tasks={doneTasks}
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            startDate={startDate}
            endDate={endDate}
            onTaskClick={handleTaskClick}
            onCategoryChange={setSelectedCategory} // 추가: 핸들러 전달
          />
        )}

        <TaskDetailSidebar
          task={selectedTask}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSave={handleTaskSave}
          onDelete={handleTaskDelete}
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
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
            />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
