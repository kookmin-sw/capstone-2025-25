import { useMemo, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { CompletedView } from '@/components/eisenhower/view/CompletedView.tsx';
import { TaskDetailSidebar } from '@/components/eisenhower/TaskDetailSidebar';
import { FilterBar } from '@/components/eisenhower/FilterBar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DragOverlayCard } from '@/components/eisenhower/card/DragOverlayCard';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useTaskDnD } from '@/hooks/useTaskDnD';
import { useCategoryStore } from '@/store/useCategoryStore';
import { Toaster } from 'sonner';
import type { Task, TaskSections } from '@/types/task';
import { PriorityView } from '@/components/eisenhower/view/PriorityView';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Grid2X2, Kanban } from 'lucide-react';
import useMatrixStore from '@/store/matrixStore';

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

  const { allTasks, addTask, reorderTasks } = useMatrixStore();

  const { categories } = useCategoryStore();
  const { activeTask, sensors, handleDragStart, handleDragEnd } = useTaskDnD();

  const setActiveTaskId = useMatrixStore((state) => state.setActiveTaskId);

  const handleTaskClick = (task: Task) => {
    setActiveTaskId(task.id);
  };

  const completedTasks = useMemo(
    () => allTasks.filter((task) => task.isCompleted),
    [allTasks],
  );

  const uncompletedTasks = useMemo(
    () => allTasks.filter((task) => !task.isCompleted),
    [allTasks],
  );

  const tasksByQuadrant = useMemo<TaskSections>(
    () => ({
      Q1: uncompletedTasks.filter((task) => task.quadrant === 'Q1'),
      Q2: uncompletedTasks.filter((task) => task.quadrant === 'Q2'),
      Q3: uncompletedTasks.filter((task) => task.quadrant === 'Q3'),
      Q4: uncompletedTasks.filter((task) => task.quadrant === 'Q4'),
    }),
    [uncompletedTasks],
  );

  return (
    <div className="flex min-h-0 flex-1 bg-white p-[30px] h-full">
      <div className="flex-1">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Toaster richColors position="top-center" />
          <main className="flex flex-1 min-h-0 flex-col gap-[15px] h-full">
            <div className="flex flex-col justify-between items-start w-full gap-4">
              <div className="flex gap-2 w-full justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="flex gap-5 cursor-pointer"
                  >
                    <button className="text-[32px] h-8 font-bold inline-flex items-center gap-[5px] cursor-pointer">
                      {activeTab === 'all' ? '모든 일정' : '완료된 일정'}
                      <ChevronDown className="w-8 h-8" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-40 cursor-pointer"
                  >
                    <DropdownMenuItem
                      onClick={() => setActiveTab('all')}
                      className={
                        activeTab === 'all'
                          ? 'bg-muted font-semibold cursor-pointer'
                          : 'cursor-pointer'
                      }
                    >
                      모든 일정
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActiveTab('completed')}
                      className={
                        activeTab === 'completed'
                          ? 'bg-muted font-semibold cursor-pointer'
                          : 'cursor-pointer'
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
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Grid2X2 />
                          <p>매트릭스</p>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="board">
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Kanban />
                          보드
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              </div>
              <div className="text-4 text-[#6E726E]">
                {activeTab === 'completed'
                  ? '완료된 일정을 확인하고, 필요하면 다시 실행할 수 있어요!'
                  : '중요도와 긴급도에 따라 정리하고, 우선순위를 정해 실행해보세요!'}
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
                tasks={tasksByQuadrant}
                selectedType={selectedType}
                selectedCategory={selectedCategory}
                startDate={startDate}
                endDate={endDate}
                viewMode={view}
                onTaskClick={(task) => handleTaskClick(task)}
                onReorderTask={(sectionId, newTasks) =>
                  reorderTasks(sectionId, newTasks)
                }
                onCreateTask={(newTask) => addTask(newTask)}
              />
            ) : (
              <CompletedView
                tasks={completedTasks}
                selectedType={selectedType}
                selectedCategory={selectedCategory}
                startDate={startDate}
                endDate={endDate}
                onTaskClick={(task) => handleTaskClick(task)}
                onCategoryChange={setSelectedCategory}
                onDateChange={setDateRange}
              />
            )}

            <TaskDetailSidebar categories={categories} />

            <DragOverlay>
              {activeTask && (
                <DragOverlayCard task={activeTask} categories={categories} />
              )}
            </DragOverlay>
          </main>
        </DndContext>
      </div>
    </div>
  );
}
