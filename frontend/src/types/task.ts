export interface Task {
  id: string;
  title: string;
  memo: string;
  date?: string | Date;
  tags: {
    type: 'Todo' | 'Thinking';
    category?: string;
  };
  section?: string;
}
