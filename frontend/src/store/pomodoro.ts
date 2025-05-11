import { create } from 'zustand';
import { Pomodoro } from '@/types/pomodoro';
import usePatchPomodoro from '@/hooks/queries/pomodoro/usePatchPomodoro.ts';

export const usePomodoroStore = create<Pomodoro>((set, get) => ({
  id: null,
  title: '',
  isRunning: false,
  elapsedTime: 0,
  startTimestamp: 0,
  intervalId: null,
  pausedTime: 0,
  setId: (id: number) => set({ id }),
  setTitle: (title: string) => set({ title }),
  setIsRunning: (running: boolean) => set({ isRunning: running }),
  setElapsedTime: (seconds: number) => set({ elapsedTime: seconds }),
  setStartTimestamp: (time: number) => set({ startTimestamp: time }),
  setPausedTime: (time: number) => set({ pausedTime: time }),
  setTimer: (
    id: number,
    title: string,
    patchPomodoroMutation: ReturnType<
      typeof usePatchPomodoro
    >['patchPomodoroMutation'],
  ) => {
    const { intervalId, elapsedTime, pausedTime, isRunning } = get();
    if (id !== id) {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
      if (isRunning && elapsedTime > 0) {
        patchPomodoroMutation({
          data: {
            executedCycles: [
              {
                workDuration: Math.floor((elapsedTime - pausedTime) / 60),
                breakDuration: 0,
              },
            ],
          },
        });
      }
      set({
        id: id,
        title: title,
        isRunning: false,
        elapsedTime: 0,
        startTimestamp: 0,
        intervalId: null,
        pausedTime: 0,
      });
    }
  },
  resetTimer: (
    patchPomodoroMutation: ReturnType<
      typeof usePatchPomodoro
    >['patchPomodoroMutation'],
  ) => {
    const { intervalId, pausedTime, elapsedTime } = get();

    if (intervalId !== null) {
      clearInterval(intervalId);
    }

    set({
      isRunning: false,
      elapsedTime: 0,
      startTimestamp: 0,
      intervalId: null,
      pausedTime: 0,
    });

    patchPomodoroMutation({
      data: {
        executedCycles: [
          {
            workDuration: Math.floor(elapsedTime - pausedTime / 60),
            breakDuration: 0,
          },
        ],
      },
    });
  },
  deleteTimer: (
    patchPomodoroMutation: ReturnType<
      typeof usePatchPomodoro
    >['patchPomodoroMutation'],
  ) => {
    const { intervalId, pausedTime, elapsedTime } = get();

    if (intervalId !== null) {
      clearInterval(intervalId);
    }

    localStorage.removeItem('pomodoro-state');

    set({
      id: null,
      title: '',
      isRunning: false,
      elapsedTime: 0,
      startTimestamp: 0,
      intervalId: null,
      pausedTime: 0,
    });

    patchPomodoroMutation({
      data: {
        executedCycles: [
          {
            workDuration: Math.floor((elapsedTime - pausedTime) / 60),
            breakDuration: 0,
          },
        ],
      },
    });
  },

  startTimer: () => {
    const interval = setInterval(() => {
      get().tick();
    }, 1000);
    set({
      isRunning: true,
      startTimestamp: Date.now(),
      intervalId: interval,
    });
  },

  pauseTimer: () => {
    const { intervalId } = get();
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    const now = Date.now();
    const { startTimestamp, elapsedTime } = get();
    if (startTimestamp) {
      const delta = Math.floor((now - startTimestamp) / 1000);
      set({
        isRunning: false,
        elapsedTime: elapsedTime + delta,
        startTimestamp: 0,
        pausedTime: elapsedTime + delta,
      });
    }
  },

  tick: () => {
    const { isRunning, startTimestamp, elapsedTime, pauseTimer } = get();
    if (isRunning && startTimestamp) {
      const now = Date.now();
      const delta = Math.floor((now - startTimestamp) / 1000);
      const newElapsed = elapsedTime + delta;

      if (newElapsed >= 1500) {
        pauseTimer();
        set({ elapsedTime: 1500 }); // 최대 25분까지만 고정
      } else {
        set({
          elapsedTime: newElapsed,
          startTimestamp: Date.now(),
        });
      }
    }
  },
}));
