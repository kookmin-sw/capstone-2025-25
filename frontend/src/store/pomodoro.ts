import { create } from 'zustand';
import { Pomodoro, PatchPomodoroMutationType } from '@/types/pomodoro';
import usePatchPomodoro from '@/hooks/queries/pomodoro/usePatchPomodoro.ts';

export const usePomodoroStore = create<Pomodoro>((set, get) => ({
  id: null,
  title: '',
  isRunning: false,
  elapsedTime: 0,
  startTimestamp: 0,
  intervalId: null,
  pausedTime: 0,
  patchPomodoroMutation: null,
  setPatchPomodoroMutation: (mutation: PatchPomodoroMutationType) => {
    set({ patchPomodoroMutation: mutation });
  },
  getTotalElapsedTime: () => {
    const { isRunning, elapsedTime, startTimestamp } = get();
    let totalElapsed = elapsedTime;
    if (isRunning && startTimestamp > 0) {
      const now = Date.now();
      const delta = Math.floor((now - startTimestamp) / 1000);
      totalElapsed += delta;
    }
    return totalElapsed;
  },

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
    const {
      intervalId,
      elapsedTime,
      pausedTime,
      isRunning,
      id: currentId,
      getTotalElapsedTime,
    } = get();
    if (currentId !== id) {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
      const totalElapsed = getTotalElapsedTime();
      if (isRunning && elapsedTime > 0) {
        patchPomodoroMutation({
          data: {
            executedCycles: [
              {
                workDuration: (totalElapsed - pausedTime),
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
    const { intervalId, pausedTime, getTotalElapsedTime } = get();

    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    const totalElapsed = getTotalElapsedTime();
    console.log(totalElapsed - pausedTime);
    patchPomodoroMutation({
      data: {
        executedCycles: [
          {
            workDuration: (totalElapsed - pausedTime),
            breakDuration: 0,
          },
        ],
      },
    });
    set({
      isRunning: false,
      elapsedTime: 0,
      startTimestamp: 0,
      intervalId: null,
      pausedTime: 0,
    });
  },
  deleteTimer: (
    patchPomodoroMutation: ReturnType<
      typeof usePatchPomodoro
    >['patchPomodoroMutation'],
  ) => {
    const { intervalId, pausedTime, getTotalElapsedTime } = get();

    if (intervalId !== null) {
      clearInterval(intervalId);
    }

    localStorage.removeItem('pomodoro-state');
    const totalElapsed = getTotalElapsedTime();
    patchPomodoroMutation({
      data: {
        executedCycles: [
          {
            workDuration: (totalElapsed - pausedTime),
            breakDuration: 0,
          },
        ],
      },
    });
    set({
      id: null,
      title: '',
      isRunning: false,
      elapsedTime: 0,
      startTimestamp: 0,
      intervalId: null,
      pausedTime: 0,
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

  pauseTimer: (
    patchPomodoroMutation: ReturnType<
      typeof usePatchPomodoro
    >['patchPomodoroMutation'],
  ) => {
    const { intervalId, getTotalElapsedTime,pausedTime } = get();
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    const totalElapsed = getTotalElapsedTime();

    if (totalElapsed > 0) {
      patchPomodoroMutation({
        data: {
          executedCycles: [
            {
              workDuration: (totalElapsed - pausedTime),
              breakDuration: 0,
            },
          ],
        },
      });
    }

    set({
      isRunning: false,
      elapsedTime: totalElapsed,
      startTimestamp: 0,
      pausedTime: totalElapsed,
    });
  },

  tick: () => {
    const {
      isRunning,
      startTimestamp,
      elapsedTime,
      pauseTimer,
      patchPomodoroMutation,
    } = get();
    if (isRunning && startTimestamp) {
      const now = Date.now();
      const delta = Math.floor((now - startTimestamp) / 1000);
      const newElapsed = elapsedTime + delta;

      if (newElapsed >= 1500) {
        pauseTimer(patchPomodoroMutation);
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
