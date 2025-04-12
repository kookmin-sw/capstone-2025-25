'use client';

import { useState } from 'react';
import { AllScheduleView } from '@/components/eisenhower/AllScheduleView';
import { CompletedScheduleView } from '@/components/eisenhower/CompletedScheduleView';
import { BoardView } from '@/components/eisenhower/view/BoardView';
import { TaskDetailSidebar } from '@/components/eisenhower/TaskDetailSidebar';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/eisenhower/FilterBar';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import type { Task, TaskType } from '@/types/task';
import {
  initialTasks,
  completedTasks,
} from '@/components/eisenhower/data/tasks';
import { DragOverlayCard } from '@/components/eisenhower/card/DragOverlayCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MatrixPage() {
  // View state
  const [view, setView] = useState<'matrix' | 'board'>('matrix');
  const [activeTab, setActiveTab] = useState<'all' | 'completed'>('all');

  // Filter state
  const [selectedType, setSelectedType] = useState<TaskType>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>(new Date('2022-01-01'));
  const [endDate, setEndDate] = useState<Date>(new Date('2025-12-31'));

  // Completed tasks filter state (separate filters for completed tasks)
  const [completedSelectedType, setCompletedSelectedType] =
    useState<TaskType>('ALL');
  const [completedSelectedCategory, setCompletedSelectedCategory] =
    useState<string>('all');

  // Task data
  const [tasks, setTasks] = useState(initialTasks);
  const [doneTasks, setDoneTasks] = useState(completedTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Category management
  const [categories, setCategories] = useState<string[]>([
    'category',
    'work',
    'personal',
    'study',
    'health',
    'dev',
    'marketing',
  ]);

  // DnD setup
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleAddTask = (sectionId: string, task: Task) => {
    setTasks((prev) => ({
      ...prev,
      [sectionId]: [...prev[sectionId], task],
    }));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsSidebarOpen(true);
  };

  const handleTaskSave = (updatedTask: Task) => {
    // If the task has a category that's not in our list, add it
    if (
      updatedTask.tags.category &&
      !categories.includes(updatedTask.tags.category)
    ) {
      setCategories((prev) => [...prev, updatedTask.tags.category!]);
    }

    const sectionId = updatedTask.section as keyof typeof tasks;
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

    // Update tasks that use this category
    setTasks((prev) => {
      const updated = { ...prev };
      for (const section in updated) {
        updated[section as keyof typeof updated] = updated[
          section as keyof typeof updated
        ].map((task) => {
          if (task.tags.category === categoryToDelete) {
            return {
              ...task,
              tags: { ...task.tags, category: undefined },
            };
          }
          return task;
        });
      }
      return updated;
    });

    // Update completed tasks
    setDoneTasks((prev) =>
      prev.map((task) => {
        if (task.tags.category === categoryToDelete) {
          return {
            ...task,
            tags: { ...task.tags, category: undefined },
          };
        }
        return task;
      }),
    );
  };

  // Find which section contains a task by ID
  const getSectionIdByTaskId = (taskId: string): string | undefined => {
    return Object.keys(tasks).find((sectionId) =>
      tasks[sectionId as keyof typeof tasks].some((task) => task.id === taskId),
    );
  };

  // DnD handlers
  const handleDragStart = ({ active }: any) => {
    const sectionId = getSectionIdByTaskId(active.id.toString());
    if (sectionId) {
      const task = tasks[sectionId as keyof typeof tasks].find(
        (task) => task.id === active.id,
      );
      if (task) setActiveTask(task);
    }
  };

  const handleDragEnd = ({ active, over }: any) => {
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Find section IDs
    const sourceSectionId = getSectionIdByTaskId(activeId);
    const isOverSection = Object.keys(tasks).includes(overId);
    const targetSectionId = isOverSection
      ? overId
      : getSectionIdByTaskId(overId);

    if (!sourceSectionId || !targetSectionId) return;

    // Different section - move task between sections
    if (sourceSectionId !== targetSectionId) {
      setTasks((prev) => {
        const sourceSection = [...prev[sourceSectionId as keyof typeof prev]];
        const targetSection = [...prev[targetSectionId as keyof typeof prev]];
        const taskIndex = sourceSection.findIndex(
          (task) => task.id === activeId,
        );

        if (taskIndex === -1) return prev;

        const [movedTask] = sourceSection.splice(taskIndex, 1);
        // Update the section property of the task
        const updatedTask = { ...movedTask, section: targetSectionId };

        return {
          ...prev,
          [sourceSectionId]: sourceSection,
          [targetSectionId]: [...targetSection, updatedTask],
        };
      });
      return;
    }

    // Same section - reorder tasks
    setTasks((prev) => {
      const sectionTasks = [...prev[sourceSectionId as keyof typeof prev]];
      const activeIndex = sectionTasks.findIndex(
        (task) => task.id === activeId,
      );

      if (activeIndex === -1 || activeId === overId) return prev;

      if (isOverSection) {
        // Move to the end of the section
        const [movedTask] = sectionTasks.splice(activeIndex, 1);
        return {
          ...prev,
          [sourceSectionId]: [...sectionTasks, movedTask],
        };
      } else {
        // Move to a specific position
        const overIndex = sectionTasks.findIndex((task) => task.id === overId);
        if (overIndex === -1) return prev;

        const [movedTask] = sectionTasks.splice(activeIndex, 1);
        sectionTasks.splice(overIndex, 0, movedTask);

        return {
          ...prev,
          [sourceSectionId]: sectionTasks,
        };
      }
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={(args) => {
        // Combine collision detection strategies
        const pointerCollisions = pointerWithin(args);
        const rectCollisions = rectIntersection(args);
        const allCollisions = [...pointerCollisions, ...rectCollisions];

        // Remove duplicates
        return allCollisions.filter(
          (collision, index, self) =>
            self.findIndex((c) => c.id === collision.id) === index,
        );
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative p-4 md:p-6">
        {/* 필터 & 뷰 전환 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">우선순위 매트릭스</h1>
          <div className="flex gap-2">
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as 'all' | 'completed')
              }
            >
              <TabsList>
                <TabsTrigger value="all">모든 일정</TabsTrigger>
                <TabsTrigger value="completed">완료된 일정</TabsTrigger>
              </TabsList>
            </Tabs>

            {activeTab === 'all' && (
              <Button
                className="whitespace-nowrap"
                variant="outline"
                onClick={() =>
                  setView((prev) => (prev === 'matrix' ? 'board' : 'matrix'))
                }
              >
                {view === 'matrix' ? '보드 뷰로 전환' : '매트릭스 뷰로 전환'}
              </Button>
            )}
          </div>
        </div>

        {/* 필터 */}
        <div className="mb-6">
          <FilterBar
            selectedType={
              activeTab === 'all' ? selectedType : completedSelectedType
            }
            selectedCategory={
              activeTab === 'all' ? selectedCategory : completedSelectedCategory
            }
            startDate={startDate}
            endDate={endDate}
            onTypeChange={
              activeTab === 'all' ? setSelectedType : setCompletedSelectedType
            }
            onCategoryChange={
              activeTab === 'all'
                ? setSelectedCategory
                : setCompletedSelectedCategory
            }
            onDateChange={handleDateChange}
          />
        </div>

        {/* 현재 뷰 */}
        {activeTab === 'all' ? (
          view === 'matrix' ? (
            <AllScheduleView
              tasks={tasks}
              view={view}
              selectedType={selectedType}
              selectedCategory={selectedCategory}
              startDate={startDate}
              endDate={endDate}
              onTypeChange={setSelectedType}
              onCategoryChange={setSelectedCategory}
              onDateChange={handleDateChange}
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTask}
            />
          ) : (
            <BoardView
              tasks={tasks}
              selectedType={selectedType}
              selectedCategory={selectedCategory}
              startDate={startDate}
              endDate={endDate}
              onTypeChange={setSelectedType}
              onCategoryChange={setSelectedCategory}
              onDateChange={handleDateChange}
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTask}
            />
          )
        ) : (
          <CompletedScheduleView
            tasks={doneTasks}
            selectedType={completedSelectedType}
            selectedCategory={completedSelectedCategory}
            startDate={startDate}
            endDate={endDate}
            onTaskClick={handleTaskClick}
            onTypeChange={setCompletedSelectedType}
            onCategoryChange={setCompletedSelectedCategory}
            onDateChange={handleDateChange}
          />
        )}

        {/* 상세보기 사이드바 */}
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

        {/* Drag overlay */}
        <DragOverlay>
          {activeTask ? (
            <DragOverlayCard
              title={activeTask.title}
              memo={activeTask.memo}
              date={activeTask.date}
              tags={activeTask.tags}
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
