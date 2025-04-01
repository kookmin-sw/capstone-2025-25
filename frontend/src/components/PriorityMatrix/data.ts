export interface TaskCardType {
  id: string;
  title: string;
  memo?: string;
  date?: string;
  category?: string;
}

export type ColumnData = Record<string, TaskCardType[]>;

export const initialData: ColumnData = {
  '긴급하고 중요한 일': [
    { id: '1', title: '서류 제출', memo: '오늘까지 마감' },
    { id: '2', title: '회의 준비' },
  ],
  '긴급하진 않지만 중요한 일': [{ id: '3', title: '포트폴리오 업데이트' }],
  '긴급하지만 중요하지 않은 일': [],
  '긴급하지도 중요하지도 않은 일': [],
};
