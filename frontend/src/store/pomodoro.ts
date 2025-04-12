import { pomodoroMockData } from '@/mock/pomorodo';
import { PomodoroList } from '@/types/pomodoro';
import { create } from 'zustand';

export type PomodoroListState = {
  pomodoros: PomodoroList;
};

const useStore = create<PomodoroListState>(() => ({
  pomodoros: pomodoroMockData,
}));

export const usePomodoros = () => useStore((state) => state.pomodoros);

export default useStore;
