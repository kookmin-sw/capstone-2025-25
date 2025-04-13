export type ActualTaskType = 'TODO' | 'THINKING';
export type TaskType = ActualTaskType | 'ALL';

export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface Task {
  id?: number | string;
  title: string;
  categoryId: number | null;
  dueDate: string;
  quadrant: Quadrant;
  type: TaskType;
  order: number;
  memo: string;
}

export interface TaskDetail {
  id?: number | string;
  title: string;
  memo: string;
  categoryId: number | null;
  quadrant: Quadrant;
  type: TaskType;
  dueDate: string | null;
  order: number;
  isCompleted: boolean;
  createdAt: string;
  mindMapId: number;
  pomodoroId: number;
}
