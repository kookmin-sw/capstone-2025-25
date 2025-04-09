'use client';

import { useState } from 'react';
import { Droppable } from '@/components/PriorityMatrix/Droppable';
import { TaskCard } from '@/components/PriorityMatrix/card/TaskCard.tsx';
import { FilterBar } from '@/components/PriorityMatrix/FilterBar';
import { CreateTaskModal } from '@/components/PriorityMatrix/modal/CreateTaskModal';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Task } from '@/types/task';

interface AllScheduleViewProps {
  tasks: {
    section1: Task[];
    section2: Task[];
    section3: Task[];
    section4: Task[];
  };
  view: 'matrix' | 'board';
  selectedType: 'all' | 'Todo' | 'Thinking';
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onTypeChange: (type: 'all' | 'Todo' | 'Thinking') => void;
  onCategoryChange: (category: string) => void;
  onDateChange: (start: Date, end: Date) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (sectionId: string, task: Task) => void;
}

export function AllScheduleView({
  tasks,
  view,
  selectedType,
  selectedCategory,
  startDate,
  endDate,
  onTypeChange,
  onCategoryChange,
  onDateChange,
  onTaskClick,
  onAddTask,
}: AllScheduleViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [activeSectionTitle, setActiveSectionTitle] = useState<string>('');

  const handleOpenModal = (sectionId: string, sectionTitle: string) => {
    setActiveSectionId(sectionId);
    setActiveSectionTitle(sectionTitle);
    setModalOpen(true);
  };

  const handleCreateTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...taskData,
    };
    onAddTask(activeSectionId, newTask);
    setModalOpen(false);
  };

  const sectionTitles = {
    section1: '긴급하고 중요한 일',
    section2: '긴급하지 않지만 중요한 일',
    section3: '긴급하지만 중요하지 않은 일',
    section4: '긴급하지도 중요하지도 않은 일',
  };

  const renderSection = (id: keyof typeof tasks, index: number) => (
    <div
      className={`bg-[#f5f1ff] rounded-lg p-4 relative ${view === 'matrix' ? 'h-[50vh]' : 'h-[calc(100vh-220px)]'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs mr-2">
            {index + 1}
          </div>
          <h3 className="font-bold text-lg">{sectionTitles[id]}</h3>
          <span className="text-xs text-gray-500 ml-2">{tasks[id].length}</span>
        </div>
        <button
          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white"
          onClick={() => handleOpenModal(id, sectionTitles[id])}
        >
          <span className="text-lg">+</span>
        </button>
      </div>
      <Droppable
        id={id}
        className="h-[calc(100%-2rem)] overflow-y-auto pr-1 custom-scrollbar"
      >
        <SortableContext
          items={tasks[id].map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-0 pt-1 pb-1">
            {tasks[id].map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                layout={view}
              />
            ))}
          </div>
        </SortableContext>
      </Droppable>
    </div>
  );

  return (
    <div className="space-y-4">
      <FilterBar
        selectedType={selectedType}
        selectedCategory={selectedCategory}
        startDate={startDate}
        endDate={endDate}
        onTypeChange={onTypeChange}
        onCategoryChange={onCategoryChange}
        onDateChange={onDateChange}
      />

      <div
        className={
          view === 'matrix'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
            : 'grid grid-cols-1 md:grid-cols-4 gap-4'
        }
      >
        {(['section1', 'section2', 'section3', 'section4'] as const).map(
          (sectionId, idx) => (
            <div key={sectionId} className="space-y-4">
              {renderSection(sectionId, idx)}
            </div>
          ),
        )}
      </div>

      <CreateTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sectionTitle={activeSectionTitle}
        sectionId={activeSectionId}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}
