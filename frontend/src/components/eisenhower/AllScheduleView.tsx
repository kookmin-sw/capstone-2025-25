'use client';

import { useState } from 'react';
import { Droppable } from '@/components/eisenhower/Droppable';
import { TaskCard } from '@/components/eisenhower/card/TaskCard';
import { FilterBar } from '@/components/eisenhower/FilterBar';
import { CreateTaskForm } from '@/components/eisenhower/modal/CreateTaskForm.tsx';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Task } from '@/types/task';
import { Modal } from '@/components/common/Modal';
import { DialogClose } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';

type AllScheduleViewProps = {
  tasks: {
    section1: Task[];
    section2: Task[];
    section3: Task[];
    section4: Task[];
  };
  view: 'matrix' | 'board';
  selectedType: 'ALL' | 'TODO' | 'THINKING';
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onTypeChange: (type: 'ALL' | 'TODO' | 'THINKING') => void;
  onCategoryChange: (category: string) => void;
  onDateChange: (start: Date, end: Date) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (sectionId: string, task: Task) => void;
};

const sectionTitles = {
  section1: '긴급하고 중요한 일',
  section2: '긴급하지 않지만 중요한 일',
  section3: '긴급하지만 중요하지 않은 일',
  section4: '긴급하지도 중요하지도 않은 일',
} as const;

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
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [, setActiveSectionTitle] = useState<string>('');

  const [taskForm, setTaskForm] = useState<Omit<Task, 'id'>>({
    title: '',
    memo: '',
    date: '',
    tags: { type: 'TODO', category: undefined },
    section: '',
  });

  const handleCreateTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...taskData,
    };
    onAddTask(activeSectionId, newTask);
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
        <Modal
          trigger={
            <button
              className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white"
              onClick={() => {
                setActiveSectionId(id);
                setActiveSectionTitle(sectionTitles[id]);
              }}
            >
              <span className="text-lg">+</span>
            </button>
          }
          title={sectionTitles[id]}
          description="새로운 작업을 추가해보세요."
          children={
            <CreateTaskForm
              sectionId={id}
              sectionTitle={sectionTitles[id]}
              form={taskForm}
              setForm={(partial) =>
                setTaskForm((prev) => ({ ...prev, ...partial }))
              }
              onCreateTask={(taskData) => {
                handleCreateTask(taskData);
                close();
              }}
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

                    handleCreateTask(taskForm);
                    close();
                    setTaskForm({
                      title: '',
                      memo: '',
                      date: '',
                      tags: { type: 'Todo', category: undefined },
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
      {/*드래그 기능*/}
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
    </div>
  );
}
