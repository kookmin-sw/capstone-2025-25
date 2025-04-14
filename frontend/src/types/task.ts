export type ActualTaskType = 'TODO' | 'THINKING';
export type TaskType = ActualTaskType | 'ALL';
export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface Task {
  id: string | number;
  title: string;
  memo: string;
  category_id: number | null;
  quadrant: Quadrant;
  type: ActualTaskType;
  dueDate: string;
  order: number;
  isCompleted: boolean;
  createdAt: string;
  mindMapId: string | number | null;
  pomodoroId: string | number | null;
}

// Tasks organized by quadrant
export type TaskSections = Record<Quadrant, Task[]>;
