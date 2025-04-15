export type GenerateReq = {
  mainNode: {
    summary: string;
  } | null;
  parentNode: {
    summary: string;
  } | null;
  selectedNode: {
    summary: string;
  } | null;
};

export type ConvertedToTaskReq = {
  selectedNodes: { summary: string }[];
};

export type SummarizedNodeReq = {
  question: string;
  answer: string;
};
