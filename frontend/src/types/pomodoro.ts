export type Pomodoro = {
  id: number | null;
  title: string;
  isRunning: boolean;
  elapsedTime: number;
  startTimestamp: number | null;
  intervalId: number | null;
  setId: (id: number) => void;
  setTitle: (title: string) => void;
  setIsRunning: (running: boolean) => void;
  setElapsedTime: (seconds: number) => void;
  setStartTimestamp: (time: number) => void;
  resetTimer: () => void;
  deleteTimer: () => void;
  pauseTimer: () => void;
  startTimer: () => void;
  tick: () => void;
};
