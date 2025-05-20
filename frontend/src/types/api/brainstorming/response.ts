import { BubbleType } from '@/types/brainstorming';

export type CreatedBubblesRes = {
  error: string | null;
  statusCode: number;
  content: BubbleType[];
};

export type MergeBubbleRes = {
  error: string | null;
  statusCode: number;
  content: BubbleType[];
};
