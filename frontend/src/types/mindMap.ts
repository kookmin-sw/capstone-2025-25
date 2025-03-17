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

export type MindMapNode = ReactFlowNode<MindMapNodeData>;

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
