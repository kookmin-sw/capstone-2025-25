export type TotalTime = {
  hour: number;
  minute: number;
  second: number;
  nano: number;
};

export type Mode = 'WORK' | 'BREAK'

export type PomodoroCycle = {
  workDuration: number;
  breakDuration: number;
};

export type Pomodoro = {
  id: number;
  title: string;
  createdAt: string;
  completedAt: string;
  totalPlannedTime: TotalTime;
  totalExecutedTime: TotalTime;
  totalWorkingTime: TotalTime;
  totalBreakTime: TotalTime;
  plannedCycles: PomodoroCycle[];
  executedCycles: PomodoroCycle[];
};

export type Eisenhower = {
  id: number;
  title: string;
  memo: string;
  dueDate: string;
  quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  type: EisenhowerType;
  order: number;
  isCompleted: boolean;
  createdAt: string;
};
export type LinkedUnlinkedPomodoro = {
  pomodoro: Pomodoro;
  eisenhower: Eisenhower | null;
};
export type PomodoroList = {
  linkedPomodoros: LinkedUnlinkedPomodoro[] | null;
  unlinkedPomodoros: LinkedUnlinkedPomodoro[]  | null;
};

export type EisenhowerType = 'TODO' | 'SCHEDULE' | 'DELEGATE' | 'DELETE';
