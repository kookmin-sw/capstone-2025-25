export type PomodoroCycle = {
  workDuration: number;
  breakDuration: number | null;
};

export type Pomodoro = {
  id: number;
  title: string;
  createdAt: string;
  completedAt: string | null;
  totalPlannedTime: string | null;
  totalExecutedTime: string | null;
  totalWorkingTime: string | null;
  totalBreakTime: string | null;
  plannedCycles: PomodoroCycle[];
  executedCycles: PomodoroCycle[] | null;
};

export type Eisenhower = {
  id: number;
  title: string;
};

export type PomodoroData = {
  pomodoro: Pomodoro;
  eisenhower: Eisenhower | null;
};

export type PomodoroResponse = {
  statusCode: number;
  error: string | null;
  content: {
    linkedPomodoros: PomodoroData[];
    unlinkedPomodoros: PomodoroData[];
  };
};
// 서브 사이드바의 item
export type PomodoroItemProps = {
  title: string;
  eisenhower: Eisenhower | null;
  time: string;
  selected?: boolean;
  onRemove?: () => void;
};
