import { MindMapSummary } from '@/types/mindMap';

export type GeneratedScheduleRes = {
  generated_questions: string[];
};

export type GeneratedThoughtRes = {
  generated_questions: string[];
};

export type ConvertedToTaskRes = {
  task: {
    title: string;
  };
};

export type SummarizedNodeRes = {
  summary: string;
};

export type CreateRootNodeRes = {
  error: string | null;
  statusCode: number;
  content: number;
};

export type GetMindmapListRes = {
  statusCode: number;
  error: string | null;
  content: MindMapSummary[];
};
