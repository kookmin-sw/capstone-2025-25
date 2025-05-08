import { todayTodo } from '@/types/todayTodo';

export type GetTodayTodoListRes = {
  statusCode: number;
  error: string | null;
  content: {
    content: todayTodo[];
  };
};
