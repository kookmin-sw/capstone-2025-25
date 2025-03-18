import { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react';

export type TodoType = 'TODO' | 'THINKING';

export type MindMapNodeType = 'root' | 'question' | 'answer' | 'summary';

export type MindMapNodeData = {
  label: string;
  answer?: string | null;
  summary?: string | null;
  depth: number;
  recommendedQuestions?: string[];
};

export type RootNodeType = ReactFlowNode<MindMapNodeData, 'root'>;
export type QuestionNodeType = ReactFlowNode<MindMapNodeData, 'question'>;
export type AnswerNodeType = ReactFlowNode<MindMapNodeData, 'answer'>;
export type SummaryNodeType = ReactFlowNode<MindMapNodeData, 'summary'>;

export type MindMapNode =
  | RootNodeType
  | QuestionNodeType
  | AnswerNodeType
  | SummaryNodeType;

export type MindMapEdge = ReactFlowEdge;

export type MindMap = {
  id: number;
  order: number;
  type: TodoType;
  todoTime: string;
  toDoDate: string;
  title: string;
  lastModifiedAt: string;
  user_id: number;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
};
