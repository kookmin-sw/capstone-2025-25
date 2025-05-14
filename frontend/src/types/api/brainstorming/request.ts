export type CreateBubbleReq = {
  text: string;
};

export type PatchBubbleReq = {
  title: string;
};

export type CreateMatrixReq = {
  title: string;
  categoryId?: number | null;
  dueDate: string;
  quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  order: number;
  memo: string;
};
