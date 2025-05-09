import { todayTodo } from '@/types/todayTodo';

export type GetTodayTodoListRes = {
  statusCode: number;
  error: string | null;
  content: {
    content: todayTodo[];
  };
};

export type GetTodayCountRes = {
  statusCode: number;
  error: string | null;
  content: number;
};

export type MoveTodayRes = {
  statusCode: number;
  error: string | null;
  content: {
    id: number;
    title: string;
    category_id: number;
    meno: string;
    dueDate: string;
    taskDate: string;
    isCompleted: boolean;
  };
};
