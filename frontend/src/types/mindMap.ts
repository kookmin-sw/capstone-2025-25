import { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react';

export type TodoType = 'TODO' | 'THINKING';

export type MindMapNodeType = 'root' | 'question' | 'answer' | 'summary';

export type MindMapNodeData = {
  label: string;
  answer?: string | null;
  summary?: string | null;
  depth: number;
  recommendedQuestions?: string[];
  isPending?: boolean;
  isEditing?: boolean;
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
  id: string;
  order?: number;
  type: TodoType;
  title: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
};
