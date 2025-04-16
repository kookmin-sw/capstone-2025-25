import { EisenhowerBase, Quadrant } from '@/types/commonTypes';

export interface Task extends EisenhowerBase {
  category_id: number | null;
  mindMapId: number | null;
  pomodoroId: number | null;
}

export type TaskSections = Record<Quadrant, Task[]>;
