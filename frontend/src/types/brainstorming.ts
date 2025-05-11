export type BubbleType = {
  bubbleId: number;
  title: string;
};

export type BubbleNodeType = {
  bubbleId: number;
  title: string;
  radius: number;
  x: number;
  y: number;
  isDeleting?: boolean;
  isNew?: boolean;
};
