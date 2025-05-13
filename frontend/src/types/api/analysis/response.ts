import { PomodoroAnalysis, TodayTaskAnalysis } from '@/types/analysis';

export type GetTodayTaskAnalysisRes = {
  statusCode: number;
  error: string | null;
  content: TodayTaskAnalysis[];
};

export type GetPomodoroanalysisRes = {
  statusCode: number;
  error: string | null;
  content: PomodoroAnalysis[];
};
