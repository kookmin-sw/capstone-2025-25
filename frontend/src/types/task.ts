export type TaskType = 'Todo' | 'Thinking' | 'all';

export interface Task {
  id: string;
  title: string;
  memo: string;
  date?: string | Date;
  tags: {
    type: TaskType;
    category?: string;
  };
  section?: string;
}
