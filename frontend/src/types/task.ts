export type ActualTaskType = 'TODO' | 'THINKING';
export type TaskType = ActualTaskType | 'ALL';

export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface Task {
  id: string | number;
  title: string;
  memo: string;
  dueDate: string | null;
  type: ActualTaskType;
  categoryId: number | null;
  quadrant: Quadrant;
  order: number;
}

export interface TaskDetail extends Task {
  isCompleted: boolean;
  createdAt: string;
  mindMapId: number | null;
  pomodoroId: number | null;
}

export type TaskSections = Record<Quadrant, Task[]>;
