import { create } from 'zustand';
import { tasks, getTasksByQuadrant } from '@/mock/task';
import type { Task, TaskSections, Quadrant } from '@/types/task';
import { toast } from 'sonner';

export type MatrixState = {
  allTasks: Task[];
  tasksByQuadrant: TaskSections;
  activeTaskId: string | number | null;

  setTasks: (tasks: Task[]) => void;
  updateTask: (taskId: string | number, updatedTask: Task) => void;
  addTask: (newTask: Task) => void;
  deleteTask: (taskId: string | number) => void;
  reorderTasks: (sectionId: Quadrant, newTasks: Task[]) => void;
  saveTask: (updatedTask: Task) => void;

  setActiveTaskId: (taskId: string | number | null) => void;
  getActiveTask: () => Task | null;

  getTasksByQuadrant: () => TaskSections;
  getCompletedTasks: () => Task[];
  getUncompletedTasks: () => Task[];
};

const useMatrixStore = create<MatrixState>((set, get) => ({
  allTasks: tasks,
  tasksByQuadrant: getTasksByQuadrant(),
  activeTaskId: null,

  setTasks: (tasks) =>
    set({
      allTasks: tasks,
      tasksByQuadrant: {
        Q1: tasks.filter((task) => task.quadrant === 'Q1'),
        Q2: tasks.filter((task) => task.quadrant === 'Q2'),
        Q3: tasks.filter((task) => task.quadrant === 'Q3'),
        Q4: tasks.filter((task) => task.quadrant === 'Q4'),
      },
    }),

  updateTask: (taskId, updatedTask) =>
    set((state) => {
      const updatedTasks = state.allTasks.map((task) =>
        task.id === taskId ? updatedTask : task,
      );

      return {
        allTasks: updatedTasks,
        tasksByQuadrant: {
          Q1: updatedTasks.filter((task) => task.quadrant === 'Q1'),
          Q2: updatedTasks.filter((task) => task.quadrant === 'Q2'),
          Q3: updatedTasks.filter((task) => task.quadrant === 'Q3'),
          Q4: updatedTasks.filter((task) => task.quadrant === 'Q4'),
        },
      };
    }),

  addTask: (newTask) =>
    set((state) => {
      const updatedTasks = [...state.allTasks, newTask];

      return {
        allTasks: updatedTasks,
        tasksByQuadrant: {
          ...state.tasksByQuadrant,
          [newTask.quadrant]: [
            ...state.tasksByQuadrant[newTask.quadrant],
            newTask,
          ],
        },
      };
    }),

  deleteTask: (taskId) => {
    set((state) => {
      const updatedTasks = state.allTasks.filter((task) => task.id !== taskId);

      return {
        allTasks: updatedTasks,
        tasksByQuadrant: {
          Q1: updatedTasks.filter((task) => task.quadrant === 'Q1'),
          Q2: updatedTasks.filter((task) => task.quadrant === 'Q2'),
          Q3: updatedTasks.filter((task) => task.quadrant === 'Q3'),
          Q4: updatedTasks.filter((task) => task.quadrant === 'Q4'),
        },
        activeTaskId: null,
      };
    });

    toast.success('작업이 삭제되었습니다.');
  },

  reorderTasks: (sectionId, newTasks) =>
    set((state) => {
      // 다른 쿼드런트의 태스크는 그대로 유지하고 해당 쿼드런트만 업데이트
      const updatedAllTasks = [
        ...state.allTasks.filter((task) => task.quadrant !== sectionId),
        ...newTasks,
      ];

      return {
        allTasks: updatedAllTasks,
        tasksByQuadrant: {
          ...state.tasksByQuadrant,
          [sectionId]: newTasks,
        },
      };
    }),

  setActiveTaskId: (taskId) => set({ activeTaskId: taskId }),

  getActiveTask: () => {
    const { allTasks, activeTaskId } = get();
    if (!activeTaskId) return null;

    return allTasks.find((task) => task.id === activeTaskId) || null;
  },

  saveTask: (updatedTask) => {
    const { updateTask } = get();
    updateTask(updatedTask.id, updatedTask);

    set({ activeTaskId: null });
    toast.success('작업이 저장되었습니다.');
  },

  getTasksByQuadrant: () => {
    const { allTasks } = get();
    return {
      Q1: allTasks.filter((task) => task.quadrant === 'Q1'),
      Q2: allTasks.filter((task) => task.quadrant === 'Q2'),
      Q3: allTasks.filter((task) => task.quadrant === 'Q3'),
      Q4: allTasks.filter((task) => task.quadrant === 'Q4'),
    };
  },

  getCompletedTasks: () => {
    const { allTasks } = get();
    return allTasks.filter((task) => task.isCompleted);
  },

  getUncompletedTasks: () => {
    const { allTasks } = get();
    return allTasks.filter((task) => !task.isCompleted);
  },
}));

export default useMatrixStore;
