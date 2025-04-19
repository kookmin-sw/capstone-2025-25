import { ActualTaskType } from '@/types/commonTypes';
import { MindMapEdge, MindMapNode } from '@/types/mindMap';

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

export type CreateRootNodeReq = {
  eisenhowerId: number | null;
  title: string;
  type: ActualTaskType;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
};
