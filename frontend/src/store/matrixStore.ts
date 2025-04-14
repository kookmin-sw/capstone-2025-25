import { create } from 'zustand';
import { initialTasks, completedTasks } from '@/mock/task';
import type { Task, TaskSections, Quadrant, TaskDetail } from '@/types/task';
import { toast } from 'sonner';

export type MatrixState = {
  tasks: TaskSections;
  completedTasks: TaskSections;
  activeTaskId: string | number | null;

  setTasks: (tasks: TaskSections) => void;
  updateTask: (
    sectionId: Quadrant,
    taskId: string | number,
    updatedTask: Task,
  ) => void;
  addTask: (sectionId: Quadrant, newTask: Task) => void;
  deleteTask: (taskId: string | number) => void;
  saveTask: (updatedTask: TaskDetail) => void;
  reorderTasks: (sectionId: Quadrant, newTasks: Task[]) => void;

  setActiveTaskId: (taskId: string | number | null) => void;
  getActiveTask: () => Task | null;
};

const useMatrixStore = create<MatrixState>((set, get) => ({
  tasks: initialTasks,
  completedTasks: completedTasks,
  activeTaskId: null,

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

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: Object.fromEntries(
        Object.entries(state.tasks).map(([key, taskList]) => [
          key,
          taskList.filter((task) => task.id !== taskId),
        ]),
      ) as TaskSections,
      activeTaskId: null,
    }));

    toast.success('작업이 삭제되었습니다.');
  },

  reorderTasks: (sectionId, newTasks) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [sectionId]: newTasks,
      },
    })),

  setActiveTaskId: (taskId) => set({ activeTaskId: taskId }),

  getActiveTask: () => {
    const { tasks, completedTasks, activeTaskId } = get();
    if (!activeTaskId) return null;

    for (const quadrant in tasks) {
      const found = tasks[quadrant as Quadrant].find(
        (task) => task.id === activeTaskId,
      );
      if (found) return found;
    }

    for (const quadrant in completedTasks) {
      const found = completedTasks[quadrant as Quadrant].find(
        (task) => task.id === activeTaskId,
      );
      if (found) return found;
    }

    return null;
  },

  saveTask: (updatedTask: TaskDetail) => {
    const { updateTask } = get();
    const sectionId = updatedTask.quadrant;
    const safeTask: Task = {
      ...updatedTask,
      dueDate: updatedTask.dueDate ?? '',
    };

    updateTask(sectionId, safeTask.id, safeTask);

    set({ activeTaskId: null });
    toast.success('작업이 저장되었습니다.');
  },
}));

export default useMatrixStore;
