export interface Task {
  id: string;
  title: string;
  memo: string;
  date?: string;
  tags: {
    type: 'Todo' | 'Thinking';
    category?: string;
  };
  section?: string;
}
