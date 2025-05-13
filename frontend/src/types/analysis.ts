export type TodayTaskAnalysis = {
  id: number;
  taskDate: string;
  dayOfWeek: string;
  completedNum: 0;
};

export type PomodoroAnalysis = {
  dailyPomodoroSummaryId: number;
  createdAt: string;
  totalTime: string;
};
