// TaskModalProvider.tsx
import { createContext, useContext, useState } from 'react';
import type { Task } from '@/types/task';

interface TaskModalContextProps {
  isOpen: boolean;
  task: Task | null;
  mode: 'create' | 'edit';
  quadrant: string | null;
  openModal: (options?: { task?: Task; quadrant?: string }) => void;
  closeModal: () => void;
}

const TaskModalContext = createContext<TaskModalContextProps | undefined>(undefined);

export function TaskModalProvider({ children }: { children: React.ReactNode }) {
  const [task, setTask] = useState<Task | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [quadrant, setQuadrant] = useState<string | null>(null);

  const openModal = ({ task, quadrant }: { task?: Task; quadrant?: string } = {}) => {
    setTask(task ?? null);
    setQuadrant(quadrant ?? null);
    setMode(task ? 'edit' : 'create');
    setIsOpen(true);
  };

  const closeModal = () => {
    setTask(null);
    setQuadrant(null);
    setIsOpen(false);
  };

  return (
    <TaskModalContext.Provider value={{ isOpen, task, quadrant, mode, openModal, closeModal }}>
  {children}
  </TaskModalContext.Provider>
);
}

export function useTaskModal() {
  const context = useContext(TaskModalContext);
  if (!context) throw new Error('useTaskModal must be used within TaskModalProvider');
  return context;
}
