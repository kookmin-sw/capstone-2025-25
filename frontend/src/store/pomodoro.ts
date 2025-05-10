import { create } from 'zustand';
import { Pomodoro } from '@/types/pomodoro';

export const usePomodoroStore = create<Pomodoro>((set, get) => ({
  id: null,
  title: '',
  isRunning: false,
  elapsedTime: 0,
  startTimestamp: null,
  intervalId: null,

  setId: (id: number) => set({ id }),
  setTitle: (title: string) => set({ title }),
  setIsRunning: (running: boolean) => set({ isRunning: running }),
  setElapsedTime: (seconds: number) => set({ elapsedTime: seconds }),
  setStartTimestamp: (time: number) => set({ startTimestamp: time }),

  resetTimer: () => {
    const { intervalId } = get();
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    set({
      isRunning: false,
      elapsedTime: 0,
      startTimestamp: null,
      intervalId: null,
    });
  },

  deleteTimer: () => {
    localStorage.removeItem('pomodoro-state');
    const { intervalId } = get();
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    set({
      id: null,
      title: '',
      isRunning: false,
      elapsedTime: 0,
      startTimestamp: null,
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
        startTimestamp: null,
      });
    }
  },

  tick: () => {
    const { isRunning, startTimestamp, elapsedTime } = get();
    if (isRunning && startTimestamp) {
      const now = Date.now();
      const delta = Math.floor((now - startTimestamp) / 1000);
      set({ elapsedTime: elapsedTime + delta, startTimestamp: Date.now() });
    }
  },
}));
