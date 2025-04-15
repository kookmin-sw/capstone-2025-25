import { pomodoroMockData } from '@/mock/pomorodo';
import {
  PomodoroList,
  Pomodoro,
  LinkedUnlinkedPomodoro,
  Eisenhower,
  PomodoroCycle,
  TotalTime,
} from '@/types/pomodoro';
import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';

export type PomodoroListState = {
  pomodoros: PomodoroList;

  createPomodoro: (newPomodoroData: {
    title: string;
    plannedCycles: PomodoroCycle[];
    totalPlannedTime: TotalTime;
    eisenhower: Eisenhower | null;
  }) => string;
  deletePomodoro: (id: number) => void;
  disconnectPomodoroTask: (pomodoroId: number) => void;
};

const useStore = create<PomodoroListState>((set) => ({
  pomodoros: pomodoroMockData,

  createPomodoro: (newPomodoroData) => {
    const newId = parseInt(nanoid(8), 36) % 10000;
    const now = new Date().toISOString();

    const newPomodoro: Pomodoro = {
      id: newId,
      title: newPomodoroData.title,
      createdAt: now,
      completedAt: '',
      totalPlannedTime: newPomodoroData.totalPlannedTime,
      totalExecutedTime: {
        hour: 0,
        minute: 0,
        second: 0,
        nano: 0,
      },
      totalWorkingTime: {
        hour: 0,
        minute: 0,
        second: 0,
        nano: 0,
      },
      totalBreakTime: {
        hour: 0,
        minute: 0,
        second: 0,
        nano: 0,
      },
      plannedCycles: newPomodoroData.plannedCycles,
      executedCycles: [],
    };

    const newPomodoroItem: LinkedUnlinkedPomodoro = {
      pomodoro: newPomodoro,
      eisenhower: newPomodoroData.eisenhower,
    };

    set((state) => {
      const updatedPomodoros = { ...state.pomodoros };

      if (newPomodoroData.eisenhower) {
        updatedPomodoros.linkedPomodoros = [
          ...(updatedPomodoros.linkedPomodoros || []),
          newPomodoroItem,
        ];
      } else {
        updatedPomodoros.unlinkedPomodoros = [
          ...(updatedPomodoros.unlinkedPomodoros || []),
          newPomodoroItem,
        ];
      }

      return { pomodoros: updatedPomodoros };
    });

    return newId;
  },

  deletePomodoro: (id) => {
    set((state) => {
      const updatedPomodoros = { ...state.pomodoros };

      if (updatedPomodoros.linkedPomodoros) {
        updatedPomodoros.linkedPomodoros =
          updatedPomodoros.linkedPomodoros.filter(
            (item) => item.pomodoro.id !== id,
          );
      }

      if (updatedPomodoros.unlinkedPomodoros) {
        updatedPomodoros.unlinkedPomodoros =
          updatedPomodoros.unlinkedPomodoros.filter(
            (item) => item.pomodoro.id !== id,
          );
      }

      return { pomodoros: updatedPomodoros };
    });
  },

  disconnectPomodoroTask: (pomodoroId) => {
    set((state) => {
      const updatedPomodoros = { ...state.pomodoros };

      if (updatedPomodoros.linkedPomodoros) {
        const pomodoroIndex = updatedPomodoros.linkedPomodoros.findIndex(
          (item) => item.pomodoro.id === pomodoroId,
        );

        if (pomodoroIndex !== -1) {
          const pomodoro = updatedPomodoros.linkedPomodoros[pomodoroIndex];

          const unlinkedPomodoro = {
            pomodoro: pomodoro.pomodoro,
            eisenhower: null,
          };

          updatedPomodoros.linkedPomodoros =
            updatedPomodoros.linkedPomodoros.filter(
              (item) => item.pomodoro.id !== pomodoroId,
            );

          updatedPomodoros.unlinkedPomodoros = [
            ...(updatedPomodoros.unlinkedPomodoros || []),
            unlinkedPomodoro,
          ];
        }
      }

      return { pomodoros: updatedPomodoros };
    });
  },
}));

export const usePomodoros = () => useStore((state) => state.pomodoros);
export const useCreatePomodoro = () =>
  useStore((state) => state.createPomodoro);
export const useDeletePomodoro = () =>
  useStore((state) => state.deletePomodoro);
export const useDisconnectPomodoroTask = () =>
  useStore((state) => state.disconnectPomodoroTask);

export default useStore;
