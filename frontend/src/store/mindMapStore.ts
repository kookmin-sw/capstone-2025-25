import {
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
} from '@xyflow/react';
import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';
import { MindMapEdge, MindMapNode, MindMapNodeData } from '@/types/mindMap';

export type RFState = {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addChildNode: (parentNode: Node, position: XYPosition) => void;
  setNode: (nodeId: string, node: MindMapNode) => void;
};

const initialNodes: MindMapNode[] = [
  {
    id: '1',
    type: 'root',
    data: { label: '프로젝트 계획', depth: 0 },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'summary',
    data: { label: '디자인', depth: 1, summary: '요약말' },
    position: { x: -300, y: 300 },
  },
  {
    id: '3',
    type: 'summary',
    data: { label: '개발', depth: 1, summary: '요약말' },
    position: { x: 500, y: 500 },
  },
];

const initialEdges: MindMapEdge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'mindmapEdge',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'mindmapEdge',
  },
];

const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as MindMapNode[],
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addChildNode: (parentNode: Node, position: XYPosition) => {
    const parentDepth = (parentNode.data as MindMapNodeData)?.depth || 0;

    const newNode: MindMapNode = {
      id: nanoid(),
      type: 'question',
      data: {
        label: '다음 질문을 선택해주세요',
        depth: parentDepth + 1,
        recommendedQuestions: [
          '질문1',
          '질문2',
          '질문3',
          '질문4',
          '질문5',
          '질문6',
        ],
      },
      position,
    };

    const newEdge: MindMapEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
      type: 'mindmapEdge',
    };

    console.log('Created new edge:', newEdge);

    set((state) => ({
      nodes: [...state.nodes, newNode],
      edges: [...state.edges, newEdge],
    }));
  },

  setNode: (nodeId, updatedNode) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? updatedNode : node,
      ),
    });
  },
}));

export const useNodes = () => useStore((state) => state.nodes);
export const useEdges = () => useStore((state) => state.edges);
export const useNodesChange = () => useStore((state) => state.onNodesChange);
export const useEdgesChange = () => useStore((state) => state.onEdgesChange);
export const useAddChildNode = () => useStore((state) => state.addChildNode);
export const useSetNode = () => useStore((state) => state.setNode);

export default useStore;
