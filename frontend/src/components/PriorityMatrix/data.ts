export interface TaskCardType {
  id: string;
  title: string;
  memo?: string;
  date?: string;
  category?: string;
}

export const initialTasks = {
  section1: [
    {
      id: 'task-1',
      title: 'title',
      memo: '이곳은 메모~!~!~!',
      date: '2022-01-25',
      tags: { type: 'Thinking' as const, category: 'category' },
    },
    {
      id: 'task-2',
      title: 'title',
      memo: 'memo',
      date: '2022-01-26',
      tags: { type: 'Todo' as const, category: 'category' },
    },
    {
      id: 'task-1-1',
      title: '스크롤 테스트 1',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-25',
      tags: { type: 'Thinking' as const, category: 'category' },
    },
    {
      id: 'task-1-2',
      title: '스크롤 테스트 2',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-26',
      tags: { type: 'Todo' as const, category: 'work' },
    },
    {
      id: 'task-1-3',
      title: '스크롤 테스트 3',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-27',
      tags: { type: 'Thinking' as const, category: 'personal' },
    },
    {
      id: 'task-1-4',
      title: '스크롤 테스트 4',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-28',
      tags: { type: 'Todo' as const, category: 'study' },
    },
    {
      id: 'task-1-5',
      title: '스크롤 테스트 5',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-29',
      tags: { type: 'Thinking' as const, category: 'health' },
    },
  ],
  section2: [
    {
      id: 'task-4',
      title: 'title',
      memo: 'memo',
      date: '2022-01-28',
      tags: { type: 'Todo' as const, category: 'category' },
    },
    {
      id: 'task-3',
      title: 'title',
      memo: 'memo',
      date: '2022-01-27',
      tags: { type: 'Thinking' as const, category: 'category' },
    },
    {
      id: 'task-2-1',
      title: '스크롤 테스트 1',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-25',
      tags: { type: 'Thinking' as const, category: 'work' },
    },
    {
      id: 'task-2-2',
      title: '스크롤 테스트 2',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-26',
      tags: { type: 'Todo' as const, category: 'personal' },
    },
    {
      id: 'task-2-3',
      title: '스크롤 테스트 3',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-27',
      tags: { type: 'Thinking' as const, category: 'study' },
    },
  ],
  section3: [
    {
      id: 'task-5',
      title: 'title',
      memo: 'memo',
      date: '2022-01-29',
      tags: { type: 'Todo' as const, category: 'category' },
    },
    {
      id: 'task-3-1',
      title: '스크롤 테스트 1',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-25',
      tags: { type: 'Thinking' as const, category: 'health' },
    },
    {
      id: 'task-3-2',
      title: '스크롤 테스트 2',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-26',
      tags: { type: 'Todo' as const, category: 'work' },
    },
    {
      id: 'task-3-3',
      title: '스크롤 테스트 3',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-27',
      tags: { type: 'Thinking' as const, category: 'personal' },
    },
  ],
  section4: [
    {
      id: 'task-6',
      title: 'title',
      memo: 'memo',
      date: '2022-01-30',
      tags: { type: 'Todo' as const, category: 'category' },
    },
    {
      id: 'task-7',
      title: 'title',
      memo: 'memo',
      tags: { type: 'Thinking' as const, category: 'category' },
    },
    {
      id: 'task-4-1',
      title: '스크롤 테스트 1',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-25',
      tags: { type: 'Thinking' as const, category: 'study' },
    },
    {
      id: 'task-4-2',
      title: '스크롤 테스트 2',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-26',
      tags: { type: 'Todo' as const, category: 'health' },
    },
    {
      id: 'task-4-3',
      title: '스크롤 테스트 3',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-27',
      tags: { type: 'Thinking' as const, category: 'work' },
    },
    {
      id: 'task-4-4',
      title: '스크롤 테스트 4',
      memo: '스크롤 테스트를 위한 메모입니다.',
      date: '2022-01-28',
      tags: { type: 'Todo' as const, category: 'personal' },
    },
  ],
};

export const completedTasks = [
  {
    id: 'task-c1',
    title: 'title',
    memo: 'memo',
    date: '2022-01-25',
    tags: { type: 'Todo' as const, category: 'category' },
  },
  {
    id: 'task-c2',
    title: 'title',
    memo: 'memo',
    date: '2022-01-26',
    tags: { type: 'Todo' as const, category: 'category' },
  },
  {
    id: 'task-c3',
    title: 'title',
    memo: 'memo',
    date: '2022-01-27',
    tags: { type: 'Thinking' as const, category: 'category' },
  },
];
