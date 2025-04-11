export type TaskType = 'Todo' | 'Thinking' | 'all';

export type Task = {
  id: string;
  title: string;
  memo: string;
  date?: string | Date;
  tags: {
    type: TaskType;
    category?: string;
  };
  section?: string;
};

export type TaskCardType = {
  id: string;
  title: string;
  memo?: string;
  date?: string;
  category?: string;
};
