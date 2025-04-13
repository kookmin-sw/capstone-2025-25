export type ActualTaskType = 'TODO' | 'THINKING';
export type TaskType = ActualTaskType | 'ALL';

export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface Task {
  id?: number | string; // 생성 시 id가 없을 수 있으므로 optional 처리
  title: string;
  categoryId: number | null;
  dueDate: string; // "YYYY-MM-DD" 형식의 문자열
  quadrant: Quadrant;
  type: TaskType; // 이제 'TODO' 또는 'THINKING'만 허용됩니다.
  order: number;
}

export interface TaskDetail {
  id: number | string;
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
