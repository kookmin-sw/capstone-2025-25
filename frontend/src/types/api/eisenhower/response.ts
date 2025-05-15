import { Notification } from '@/types/task';

export interface EisenhowerTask {
  id: number;
  title: string;
  memo: string;
  categoryId: number;
  quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  dueDate: string;
  order: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface GetTaskDetailRes {
  statusCode: number;
  error: string;
  content: EisenhowerTask;
}

export interface GetTaskListRes {
  statusCode: number;
  error: string | null;
  content: {
    content: EisenhowerTask[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
}

export type GetNotificationRes = {
  statusCode: number;
  error: string;
  content: Notification[];
};
