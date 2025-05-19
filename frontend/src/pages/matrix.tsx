import { useEffect, useMemo, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { CompletedView } from '@/components/eisenhower/view/CompletedView.tsx';
import { FilterBar } from '@/components/eisenhower/FilterBar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { DragOverlayCard } from '@/components/eisenhower/card/DragOverlayCard';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useTaskDnD } from '@/hooks/useTaskDnD';
import { useCategoryStore } from '@/store/useCategoryStore';
import type { Task } from '@/types/task';
import { PriorityView } from '@/components/eisenhower/view/PriorityView';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Grid2X2, Kanban } from 'lucide-react';
import useMatrixStore from '@/store/matrixStore';
import { eisenhowerService } from '@/services/eisenhowerService.ts';
import { useResponsive } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils.ts';

export default function MatrixPage() {
  const {
    selectedCategory,
    startDate,
    endDate,
    setSelectedCategory,
    setDateRange,
  } = useTaskFilters();

  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const { categories, fetchCategories } = useCategoryStore();
  const [view, setView] = useState<'matrix' | 'board'>('matrix');
  const [activeTab, setActiveTab] = useState<'all' | 'completed'>('all');

  const { sensors, handleDragStart, handleDragEnd } = useTaskDnD();

  const setActiveTaskId = useMatrixStore((state) => state.setActiveTaskId);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const completedTasks = useMemo(() => {
    return allTasks.filter((task) => {
      if (!task.isCompleted) return false;

      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);

      if (startDate && endDate) {
        return taskDate >= startDate && taskDate <= endDate;
      }

      if (startDate) {
        return taskDate >= startDate;
      }

      if (endDate) {
        return taskDate <= endDate;
      }

      return true;
    });
  }, [allTasks, startDate, endDate]);

  const handleTaskClick = (task: Task) => {
    setActiveTask(task);
    setActiveTaskId(task.id);
  };

  useEffect(() => {
    if (!location.pathname.includes('/matrix')) {
      setActiveTaskId(null);
    }
  }, [setActiveTaskId]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await eisenhowerService.getList();
        const fetchedTasks = res.content.content;
        setAllTasks(fetchedTasks);
      } catch (err) {
        console.error('작업 불러오기 실패:', err);
      }
    };

    fetchTasks();
    fetchCategories();
  }, []);

  const { isMobile } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const [, setIsDragging] = useState(false);

  return (
    <div className="flex min-h-0 flex-1  overflow-auto ">
      <DndContext
        sensors={sensors}
        onDragStart={(e) => {
          handleDragStart(e);
          setIsDragging(true);
        }}
        onDragEnd={(e) => {
          handleDragEnd(e);
          setIsDragging(false);
        }}
      >
        {/*<Toaster richColors position="top-center" />*/}
        <main className="flex flex-1 min-h-0 flex-col gap-[15px] h-full w-full">
          <div className="flex flex-col justify-between w-full gap-4 ">
            <div className="flex gap-2 w-full justify-between items-start min-h-12 ">
              <div className="flex flex-col gap-1 md:gap-2  items-start md:items-baseline ">
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                  <DropdownMenuTrigger
                    asChild
                    className="flex gap-5 cursor-pointer"
                  >
                    <button className="text-[28px] h-[42px]  shrink-0 text-[#525463] font-semibold inline-flex items-center gap-[5px] cursor-pointer">
                      {activeTab === 'all' ? '미완료 일정' : '완료된 일정'}
                      <ChevronDown
                        className={cn(
                          'w-8 h-8 transition-transform',
                          isOpen ? 'rotate-180' : 'rotate-0',
                        )}
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-40 flex flex-col gap-1"
                  >
                    <DropdownMenuItem
                      onClick={() => setActiveTab('all')}
                      className={cn(
                        'cursor-pointer text-[16px]',
                        activeTab === 'all' ? 'bg-muted font-semibold' : '',
                      )}
                    >
                      <h1>미완료 일정</h1>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setActiveTab('completed')}
                      className={cn(
                        'cursor-pointer text-[16px]',
                        activeTab === 'completed'
                          ? 'bg-muted font-semibold'
                          : '',
                      )}
                    >
                      <h1>완료 일정</h1>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="text-4 text-[#6E726E] h-fit break-words overflow-hidden whitespace-normal flex-1 min-w-0">
                  {activeTab === 'completed'
                    ? '완료된 일정을 확인하고, 필요하면 다시 실행할 수 있어요!'
                    : '중요도와 긴급도에 따라 정리하고, 우선순위를 정해 실행해보세요!'}
                </div>
              </div>
              {activeTab === 'all' && !isMobile && (
                <Tabs
                  value={view}
                  onValueChange={(val) => setView(val as 'matrix' | 'board')}
                  className="cursor-pointer"
                >
                  <TabsList className="px-2 bg-white rounded-[8px] h-12 flex gap-2">
                    <TabsTrigger
                      value="matrix"
                      className="h-9 data-[state=active]:bg-blue data-[state=active]:text-white bg-white text-blue rounded-md px-2 py-2 transition"
                    >
                      <div className="flex items-center gap-2">
                        <Grid2X2 />
                        <p>매트릭스</p>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger
                      value="board"
                      className="h-9 data-[state=active]:bg-blue data-[state=active]:text-white bg-white text-blue rounded-md px-2 py-2 transition"
                    >
                      <div className="flex items-center gap-2">
                        <Kanban />
                        보드
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>
          </div>

          <div>
            <FilterBar
              selectedCategory={selectedCategory}
              startDate={startDate}
              endDate={endDate}
              onCategoryChange={setSelectedCategory}
              onDateChange={setDateRange}
            />
          </div>

          {activeTab === 'all' ? (
            <PriorityView
              selectedCategory={selectedCategory}
              startDate={startDate}
              endDate={endDate}
              viewMode={view}
            />
          ) : (
            <CompletedView
              tasks={completedTasks}
              selectedCategory={selectedCategory}
              startDate={startDate}
              endDate={endDate}
              onTaskClick={handleTaskClick}
              onCategoryChange={setSelectedCategory}
              onDateChange={setDateRange}
            />
          )}
          <DragOverlay>
            {activeTask && (
              <div style={{ pointerEvents: 'none' }}>
                <DragOverlayCard task={activeTask} categories={categories} />
              </div>
            )}
          </DragOverlay>
        </main>
      </DndContext>
    </div>
  );
}
