export type TaskType = 'ALL' | 'TODO' | 'THINKING';

export type TaskCategory = string;

export type TaskTags = {
  type: TaskType;
  category?: TaskCategory;
};

export type Task = {
  id: string;
  title: string;
  memo: string;
  date?: string | Date;
  tags: TaskTags;
  section?: string;
};

export interface TaskSections {
  section1: Task[];
  section2: Task[];
  section3: Task[];
  section4: Task[];
}

export const sectionTitles = {
  section1: '긴급하고 중요한 일',
  section2: '긴급하지 않지만 중요한 일',
  section3: '긴급하지만 중요하지 않은 일',
  section4: '긴급하지도 중요하지도 않은 일',
} as const;

export type SectionId = keyof typeof sectionTitles;
