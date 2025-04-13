import { PomodoroList } from '@/types/pomodoro';

export const pomodoroMockData: PomodoroList = {
  linkedPomodoros: [
    {
      pomodoro: {
        id: 1,
        title: '개발하기',
        createdAt: '2025-04-04T19:43:39.359437',
        completedAt: '2025-04-04T19:46:58.644763',
        totalPlannedTime: {
          hour: 1,
          minute: 55,
          second: 0,
          nano: 0,
        },
        totalExecutedTime: {
          hour: 1,
          minute: 30,
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
        plannedCycles: [
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 0 },
        ],
        executedCycles: [
          { workDuration: 30, breakDuration: 5 },
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 0 },
        ],
      },
      eisenhower: {
        id: 1,
        title: '개발 프로젝트',
        memo: '깃헙에 푸시해야 함',
        dueDate: '2025-04-10',
        quadrant: 'Q1',
        type: 'TODO',
        order: 1,
        isCompleted: false,
        createdAt: '2025-04-04T19:40:00',
      },
    },
  ],

  unlinkedPomodoros: [
    {
      pomodoro: {
        id: 2,
        title: '자유',
        createdAt: '2025-04-04T19:43:41.849539',
        completedAt: '2025-04-05T09:00:00',
        totalPlannedTime: {
          hour: 1,
          minute: 55,
          second: 0,
          nano: 0,
        },
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
        plannedCycles: [
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 5 },
          { workDuration: 25, breakDuration: 0 },
        ],
        executedCycles: [],
      },
      eisenhower: null,
    },
  ],
};
