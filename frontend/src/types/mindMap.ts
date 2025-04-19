import { ActualTaskType, EisenhowerBase } from '@/types/commonTypes';
import { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react';

export type MindMapNodeType = 'ROOT' | 'QUESTION' | 'ANSWER' | 'SUMMARY';

export type MindMapNodeData = {
  question?: string | null;
  answer?: string | null;
  summary: string | null;
  depth: number;
  recommendedQuestions?: string[] | null;
  isPending?: boolean;
  isEditing?: boolean;
};

export type RootNodeType = ReactFlowNode<MindMapNodeData, 'ROOT'>;
export type QuestionNodeType = ReactFlowNode<MindMapNodeData, 'QUESTION'>;
export type AnswerNodeType = ReactFlowNode<MindMapNodeData, 'ANSWER'>;
export type SummaryNodeType = ReactFlowNode<MindMapNodeData, 'SUMMARY'>;

export type MindMapNode =
  | RootNodeType
  | QuestionNodeType
  | AnswerNodeType
  | SummaryNodeType;

export type MindMapEdge = ReactFlowEdge;

export type MindMap = {
  id: number;
  title: string;
  type: ActualTaskType;
  lastModifiedAt: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  linked: boolean;
  eisenhowerItemDTO?: EisenhowerBase;
};
