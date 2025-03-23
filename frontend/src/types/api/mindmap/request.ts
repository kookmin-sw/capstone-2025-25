import { MindMapNode } from '@/types/mindMap';

export type GeneratedScheduleReq = {
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

export type ConvertedScheduleTodoReq = {
  nodes: MindMapNode[];
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
