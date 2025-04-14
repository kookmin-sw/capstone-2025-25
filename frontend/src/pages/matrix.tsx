import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { CompletedView } from '@/components/eisenhower/view/CompletedView.tsx';
import { TaskDetailSidebar } from '@/components/eisenhower/TaskDetailSidebar';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Grid2X2, Kanban } from 'lucide-react';
import useMatrixStore from '@/store/matrixStore';

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

  const { tasks, completedTasks, addTask, reorderTasks } = useMatrixStore();

  const { categories, addCategory, removeCategory } = useCategoryStore();
  const { activeTask, sensors, handleDragStart, handleDragEnd } = useTaskDnD();

  const setActiveTaskId = useMatrixStore((state) => state.setActiveTaskId);

  const handleTaskClick = (task: TaskDetail) => {
    setActiveTaskId(task.id);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col p-4 md:p-6 h-screen">
        <Toaster richColors position="top-center" />

        <div className="flex flex-col justify-between items-start mb-6 w-full gap-4">
          <div className="flex gap-2 w-full justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-2xl font-bold inline-flex items-center gap-1 cursor-pointer">
                  {activeTab === 'all' ? '모든 일정' : '완료된 일정'}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-40 cursor-pointer"
              >
                <DropdownMenuItem
                  onClick={() => setActiveTab('all')}
                  className={
                    activeTab === 'all' ? 'bg-muted font-semibold' : ''
                  }
                >
                  모든 일정
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveTab('completed')}
                  className={
                    activeTab === 'completed' ? 'bg-muted font-semibold' : ''
                  }
                >
                  완료된 일정
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {activeTab === 'all' && (
              <Tabs
                value={view}
                onValueChange={(val) => setView(val as 'matrix' | 'board')}
                className="cursor-pointer"
              >
                <TabsList>
                  <TabsTrigger value="matrix">
                    <div className="flex items-center gap-2">
                      <Grid2X2 />
                      <p>매트릭스</p>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="board">
                    <div className="flex items-center gap-2">
                      <Kanban />
                      보드
                    </div>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
          <div>
            중요도와 긴급도에 따라 정리하고, 우선순위를 정해 실행해보세요!
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
              reorderTasks(sectionId, newTasks)
            }
            onCreateTask={(sectionId, newTask) => addTask(sectionId, newTask)}
          />
        ) : (
          <CompletedView
            tasks={Object.values(completedTasks).flat()}
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
