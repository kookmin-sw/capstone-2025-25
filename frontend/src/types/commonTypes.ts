export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface EisenhowerBase {
  id: number;
  title: string;
  memo: string;
  dueDate: string | null;
  quadrant: Quadrant;
  order: number;
  isCompleted: boolean;
  createdAt: string;
  categoryId?: number | null;
}
