import type { Task, TaskDetail, TaskSections } from '@/types/task';

// TaskDetail → Task로 변환
export function convertToTask(detail: TaskDetail): Task {
  return {
    id: detail.id,
    title: detail.title,
    memo: detail.memo,
    categoryId: detail.categoryId,
    quadrant: detail.quadrant,
    type: detail.type,
    dueDate: detail.dueDate ?? '',
    order: detail.order,
  };
}

// 미완료 태스크
export const initialTasks: TaskSections = {
  Q1: [
    {
      id: 1,
      title: '할 일 초안 정리',
      memo: '종이 메모에서 디지털로 정리',
      dueDate: '2025-03-01',
      type: 'THINKING',
      categoryId: 3,
      quadrant: 'Q1',
      order: 0,
    },
    {
      id: 2,
      title: 'UI 피드백 반영',
      memo: '디자이너 의견 반영하여 수정',
      dueDate: '2025-03-02',
      type: 'TODO',
      categoryId: 1,
      quadrant: 'Q1',
      order: 1,
    },
  ],
  Q2: [
    {
      id: 3,
      title: '마케팅 보고서 정리',
      memo: '카페24 자료 기반 요약',
      dueDate: '2025-03-08',
      type: 'TODO',
      categoryId: 4,
      quadrant: 'Q2',
      order: 0,
    },
    {
      id: 4,
      title: '캘린더 컴포넌트 정리',
      memo: 'FloatingCalendar 개선 필요',
      dueDate: '2025-03-09',
      type: 'THINKING',
      categoryId: 5,
      quadrant: 'Q2',
      order: 1,
    },
  ],
  Q3: [
    {
      id: 5,
      title: '캘린더 오늘 표시 개선',
      memo: 'isToday 함수로 강조 처리',
      dueDate: '2025-03-13',
      type: 'TODO',
      categoryId: 5,
      quadrant: 'Q3',
      order: 0,
    },
  ],
  Q4: [
    {
      id: 6,
      title: '리팩토링 작업 목록 정리',
      memo: '중복 로직 정리 필요',
      dueDate: '2025-03-17',
      type: 'TODO',
      categoryId: 5,
      quadrant: 'Q4',
      order: 0,
    },
    {
      id: 7,
      title: '타입 분리하기',
      memo: '타입 분리를 통한 컴포넌트 독립성 향상',
      dueDate: '',
      type: 'THINKING',
      categoryId: 6,
      quadrant: 'Q4',
      order: 1,
    },
  ],
};

// 완료 TaskDetail 데이터
const completedDetails: TaskDetail[] = [
  {
    id: 101,
    title: '피그마 정리',
    memo: '전체 UI 흐름 구조화 완료',
    dueDate: '2025-03-01',
    type: 'TODO',
    categoryId: 2,
    quadrant: 'Q1',
    order: 0,
    isCompleted: true,
    createdAt: '2025-02-25',
    mindMapId: 1,
    pomodoroId: 11,
  },
  {
    id: 102,
    title: '마케팅 자료 공유',
    memo: '팀 노션에 업로드 완료',
    dueDate: '2025-03-02',
    type: 'TODO',
    categoryId: 4,
    quadrant: 'Q1',
    order: 1,
    isCompleted: true,
    createdAt: '2025-02-26',
    mindMapId: 1,
    pomodoroId: 12,
  },
  {
    id: 103,
    title: '공통 UI 컴포넌트 설계',
    memo: 'DragOverlayCard 등 재사용 모듈 설계함',
    dueDate: '2025-03-03',
    type: 'THINKING',
    categoryId: 5,
    quadrant: 'Q2',
    order: 2,
    isCompleted: true,
    createdAt: '2025-02-27',
    mindMapId: 2,
    pomodoroId: 13,
  },
];

// 완료 TaskDetail → TaskSections 변환
export const completedTasks: TaskSections = {
  Q1: completedDetails.filter((t) => t.quadrant === 'Q1').map(convertToTask),
  Q2: completedDetails.filter((t) => t.quadrant === 'Q2').map(convertToTask),
  Q3: [],
  Q4: [],
};

// 전체 스케줄: 미완료 + 완료 병합
export const allTasks: TaskSections = {
  Q1: [...initialTasks.Q1, ...completedTasks.Q1],
  Q2: [...initialTasks.Q2, ...completedTasks.Q2],
  Q3: [...initialTasks.Q3, ...completedTasks.Q3],
  Q4: [...initialTasks.Q4, ...completedTasks.Q4],
};
