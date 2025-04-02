import { MindMapNode } from '@/types/mindMap';

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
