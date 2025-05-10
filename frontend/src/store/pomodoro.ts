import {create} from 'zustand';
import {Pomodoro} from '@/types/pomodoro';

export const usePomodoroStore = create<Pomodoro>((set, get) => ({
    id: null,
    title: '',
    isRunning: false,
    elapsedTime: 0,
    startTimestamp: 0,
    intervalId: null,

    setId: (id: number) => set({id}),
    setTitle: (title: string) => set({title}),
    setIsRunning: (running: boolean) => set({isRunning: running}),
    setElapsedTime: (seconds: number) => set({elapsedTime: seconds}),
    setStartTimestamp: (time: number) => set({startTimestamp: time}),
    setTimer: (id:number, title:string) => {
        const {intervalId} = get();
        if (intervalId !== null) {
            clearInterval(intervalId);
        }
        set({
            id:id,
            title:title,
            isRunning: false,
            elapsedTime: 0,
            startTimestamp: 0,
            intervalId: null,
        });
    },
    resetTimer: () => {
        const {intervalId} = get();
        if (intervalId !== null) {
            clearInterval(intervalId);
        }
        set({
            isRunning: false,
            elapsedTime: 0,
            startTimestamp: 0,
            intervalId: null,
        });
    },

    deleteTimer: () => {
        localStorage.removeItem('pomodoro-state');
        const {intervalId} = get();
        if (intervalId !== null) {
            clearInterval(intervalId);
        }
        set({
            id: null,
            title: '',
            isRunning: false,
            elapsedTime: 0,
            startTimestamp: 0,
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
        const {intervalId} = get();
        if (intervalId !== null) {
            clearInterval(intervalId);
        }
        const now = Date.now();
        const {startTimestamp, elapsedTime} = get();
        if (startTimestamp) {
            const delta = Math.floor((now - startTimestamp) / 1000);
            set({
                isRunning: false,
                elapsedTime: elapsedTime + delta,
                startTimestamp: 0,
            });
        }
    },

    tick: () => {
        const {isRunning, startTimestamp, elapsedTime, pauseTimer} = get();
        if (isRunning && startTimestamp) {
            const now = Date.now();
            const delta = Math.floor((now - startTimestamp) / 1000);
            const newElapsed = elapsedTime + delta;

            if (newElapsed >= 1500) {
                pauseTimer();
                set({elapsedTime: 1500}); // 최대 25분까지만 고정
            } else {
                set({
                    elapsedTime: newElapsed,
                    startTimestamp: Date.now(),
                });
            }
        }
    }
}));
