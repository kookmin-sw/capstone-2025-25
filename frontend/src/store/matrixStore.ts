import { create } from 'zustand';
import { initialTasks, completedTasks } from '@/mock/task';
import type { Task, TaskSections, Quadrant } from '@/types/task';

export type MatrixState = {
  tasks: TaskSections;
  completedTasks: TaskSections;

  setTasks: (tasks: TaskSections) => void;
  updateTask: (
    sectionId: Quadrant,
    taskId: string | number,
    updatedTask: Task,
  ) => void;
  addTask: (sectionId: Quadrant, newTask: Task) => void;
  deleteTask: (taskId: string | number) => void;
  reorderTasks: (sectionId: Quadrant, newTasks: Task[]) => void;
};

const useMatrixStore = create<MatrixState>((set) => ({
  tasks: initialTasks,
  completedTasks: completedTasks,

  setTasks: (tasks) => set({ tasks }),

  updateTask: (sectionId, taskId, updatedTask) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [sectionId]: state.tasks[sectionId].map((task) =>
          task.id === taskId ? updatedTask : task,
        ),
      },
      completedTasks: {
        ...state.completedTasks,
        [sectionId]: state.completedTasks[sectionId].map((task) =>
          task.id === taskId ? updatedTask : task,
        ),
      },
    })),

  addTask: (sectionId, newTask) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [sectionId]: [...state.tasks[sectionId], newTask],
      },
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: Object.fromEntries(
        Object.entries(state.tasks).map(([key, taskList]) => [
          key,
          taskList.filter((task) => task.id !== taskId),
        ]),
      ) as TaskSections,
    })),

  reorderTasks: (sectionId, newTasks) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [sectionId]: newTasks,
      },
    })),
}));

export default useMatrixStore;
