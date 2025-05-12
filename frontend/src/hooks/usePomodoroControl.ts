import { useEffect } from 'react';
import { usePomodoroStore } from '@/store/pomodoro.ts';

export default function usePomodoroControl() {
  const setId = usePomodoroStore((s) => s.setId);
  const setTitle = usePomodoroStore((s) => s.setTitle);
  const setIsRunning = usePomodoroStore((s) => s.setIsRunning);
  const setElapsedTime = usePomodoroStore((s) => s.setElapsedTime);

  useEffect(() => {
    const saved = localStorage.getItem('pomodoro-state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.id !== null) setId(state.id);
        if (state.title !== '') setTitle(state.title);
        if (state.isRunning !== false) setIsRunning(false);
        if (state.elapsedTime !== 0) setElapsedTime(state.elapsedTime);
      } catch (e) {
        console.error('Pomodoro 상태 복원 실패', e);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = usePomodoroStore.subscribe((state) => {
      localStorage.setItem('pomodoro-state', JSON.stringify(state));
    });
    return () => unsubscribe();
  }, []);
}
