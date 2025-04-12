import type { Task, TaskSections } from '@/types/task.ts';

export const initialTasks: TaskSections = {
  section1: [
    {
      id: 'task-1',
      title: '할 일 초안 정리',
      memo: '종이 메모에서 디지털로 정리',
      date: '2025-03-01',
      tags: { type: 'THINKING', category: 'personal' },
      section: 'section1',
    },
    {
      id: 'task-2',
      title: 'UI 피드백 반영',
      memo: '디자이너 의견 반영하여 수정',
      date: '2025-03-02',
      tags: { type: 'TODO', category: 'work' },
      section: 'section1',
    },
    // Other section1 tasks...
  ],
  section2: [
    {
      id: 'task-4',
      title: '마케팅 보고서 정리',
      memo: '카페24 자료 기반 요약',
      date: '2025-03-08',
      tags: { type: 'TODO', category: 'marketing' },
      section: 'section2',
    },
    {
      id: 'task-3',
      title: '캘린더 컴포넌트 정리',
      memo: 'FloatingCalendar 개선 필요',
      date: '2025-03-09',
      tags: { type: 'THINKING', category: 'dev' },
      section: 'section2',
    },
    // Other section2 tasks...
  ],
  section3: [
    {
      id: 'task-5',
      title: '캘린더 오늘 표시 개선',
      memo: 'isToday 함수로 강조 처리',
      date: '2025-03-13',
      tags: { type: 'TODO', category: 'dev' },
      section: 'section3',
    },
    // Other section3 tasks...
  ],
  section4: [
    {
      id: 'task-6',
      title: '리팩토링 작업 목록 정리',
      memo: '중복 로직 정리 필요',
      date: '2025-03-17',
      tags: { type: 'TODO', category: 'dev' },
      section: 'section4',
    },
    {
      id: 'task-7',
      title: '타입 분리하기',
      memo: '타입 분리를 통한 컴포넌트 독립성 향상',
      tags: { type: 'THINKING', category: 'category' },
      section: 'section4',
    },
    // Other section4 tasks...
  ],
};

export const completedTasks: Task[] = [
  {
    id: 'task-c1',
    title: '피그마 정리',
    memo: '전체 UI 흐름 구조화 완료',
    date: '2025-03-01',
    tags: { type: 'TODO', category: 'design' },
  },
  {
    id: 'task-c2',
    title: '마케팅 자료 공유',
    memo: '팀 노션에 업로드 완료',
    date: '2025-03-02',
    tags: { type: 'TODO', category: 'marketing' },
  },
  {
    id: 'task-c3',
    title: '공통 UI 컴포넌트 설계',
    memo: 'DragOverlayCard 등 재사용 모듈 설계함',
    date: '2025-03-03',
    tags: { type: 'THINKING', category: 'dev' },
  },
];
