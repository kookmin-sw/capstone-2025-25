import usePatchPomodoro from '@/hooks/queries/pomodoro/usePatchPomodoro';

export type Pomodoro = {
  id: number | null;
  title: string;
  isRunning: boolean;
  elapsedTime: number;
  startTimestamp: number;
  pausedTime: number;
  intervalId: ReturnType<typeof setInterval> | null;
  setId: (id: number) => void;
  setTitle: (title: string) => void;
  setIsRunning: (running: boolean) => void;
  setElapsedTime: (seconds: number) => void;
  setStartTimestamp: (time: number) => void;
  setPausedTime: (time: number) => void;
  setTimer: (id: number, title: string,patchFn: ReturnType<typeof usePatchPomodoro>['patchPomodoroMutation']) => void;
  resetTimer: (
    patchFn: ReturnType<typeof usePatchPomodoro>['patchPomodoroMutation']
  ) => void;
  deleteTimer: (
    patchFn: ReturnType<typeof usePatchPomodoro>['patchPomodoroMutation']
  ) => void;
  pauseTimer: () => void;
  startTimer: () => void;
  tick: () => void;
};
