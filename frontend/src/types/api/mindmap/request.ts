export type GeneratedScheduleReq = {
  mainNode?: {
    summary: string;
  };
  parentNode?: {
    summary: string;
  };
  selectedNode: {
    summary: string;
  };
};

export type GeneratedThoughtReq = {
  mainNode?: {
    summary: string;
  };
  parentNode?: {
    summary: string;
  };
  selectedNode: {
    summary: string;
  };
};

/* TODO: 마인드맵 UI PR 머지되면 MindMapNode Type으로 변경 필요 */
export type ConvertedScheduleTodoReq = {
  nodes: {
    id: string;
    parentId: string;
    type: string;
    summary: string;
  }[];
};

export type ConvertedThoughtListReq = {
  nodes: {
    id: string;
    parentId: string;
    type: string;
    summary: string;
  }[];
};

export type SummarizedNodeReq = {
  question: string;
  answer: string;
};
