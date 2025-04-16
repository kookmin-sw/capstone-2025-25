import { create } from 'zustand';
import { tasks, getTasksByQuadrant } from '@/mock/task';
import type { Task, TaskSections } from '@/types/task';
import { toast } from 'sonner';
import { Quadrant } from '@/types/commonTypes';
import { generateNumericId } from '@/lib/generateNumericId';

type DeleteTaskResult = {
  mindMapId: number | null;
  pomodoroId: number | null;
};

export type MatrixState = {
  allTasks: Task[];
  tasksByQuadrant: TaskSections;
  activeTaskId: number | null;

  setTasks: (tasks: Task[]) => void;
  updateTask: (taskId: number, updatedTask: Task) => void;
  addTask: (newTask: Task) => void;
  addTaskFromNode: (
    title: string,
    mindmapNodeId: number,
    dueDate: string | null,
    memo: string,
    quadrant?: Quadrant,
  ) => Task;
  deleteTask: (taskId: number) => DeleteTaskResult;
  reorderTasks: (sectionId: Quadrant, newTasks: Task[]) => void;
  saveTask: (updatedTask: Task) => void;
  completeTask: (taskId: number) => void;
  connectTaskToMindMap: (
    taskId: number | null,
    mindmapId: number | null,
  ) => void;
  connectTaskToPomodoro: (
    taskId: number | undefined,
    pomodoroId: number,
  ) => void;
  disconnectTaskFromMindMap: (taskId: number) => void;
  disconnectTaskFromPomodoro: (taskId: number | undefined) => void;

  setActiveTaskId: (taskId: number | null) => void;
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

  addTaskFromNode: (title, mindmapId, dueDate, memo, quadrant = 'Q1') => {
    const { addTask } = get();

    const id = generateNumericId();
    const now = new Date();
    const createdAt = now.toISOString();

    const newTask: Task = {
      id,
      title,
      memo,
      category_id: 5,
      quadrant,
      type: 'TODO',
      dueDate,
      order: get().tasksByQuadrant[quadrant].length,
      isCompleted: false,
      createdAt,
      mindMapId: mindmapId,
      pomodoroId: null,
    };

    addTask(newTask);

    toast.success('마인드맵에서 작업이 추가되었습니다.');

    return newTask;
  },

  deleteTask: (taskId) => {
    const taskToDelete = get().allTasks.find((task) => task.id === taskId);

    const mindMapId = taskToDelete?.mindMapId || null;
    const pomodoroId = taskToDelete?.pomodoroId || null;

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

    return {
      mindMapId,
      pomodoroId,
    };
  },

  reorderTasks: (sectionId, newTasks) =>
    set((state) => {
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

  completeTask: (taskId) =>
    set((state) => {
      const updatedTasks = state.allTasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: true } : task,
      );

      toast.success('작업이 완료되었습니다.');

      return {
        allTasks: updatedTasks,
      };
    }),

  connectTaskToMindMap: (taskId, mindMapId) => {
    set((state) => {
      const updatedTasks = state.allTasks.map((task) =>
        task.id === taskId ? { ...task, mindMapId } : task,
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
    });
  },

  connectTaskToPomodoro: (taskId, pomodoroId) => {
    set((state) => {
      const updatedTasks = state.allTasks.map((task) =>
        task.id === taskId ? { ...task, pomodoroId } : task,
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
    });
  },

  disconnectTaskFromMindMap: (taskId) => {
    set((state) => {
      const updatedTasks = state.allTasks.map((task) =>
        task.id === taskId ? { ...task, mindMapId: null } : task,
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
    });
  },

  disconnectTaskFromPomodoro: (taskId) => {
    set((state) => {
      const updatedTasks = state.allTasks.map((task) =>
        task.id === taskId ? { ...task, pomodoroId: null } : task,
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
    });
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
