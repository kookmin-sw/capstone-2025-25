import { TodayTaskAnalysis } from '@/types/analysis';

export type GetTodayTaskAnalysisRes = {
  statusCode: number;
  error: string | null;
  content: TodayTaskAnalysis[];
};
