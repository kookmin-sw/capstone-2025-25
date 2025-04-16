export type ActualTaskType = 'TODO' | 'THINKING';
export type TaskType = ActualTaskType | 'ALL';
export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface EisenhowerBase {
  id: number;
  title: string;
  memo: string;
  dueDate: string;
  quadrant: Quadrant;
  type: ActualTaskType;
  order: number;
  isCompleted: boolean;
  createdAt: string;
}
