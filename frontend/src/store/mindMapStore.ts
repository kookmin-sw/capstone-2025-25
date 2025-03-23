import {
  EdgeChange,
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
  addChildNode: (
    questions: string[],
    selectedNode: MindMapNode,
    position: XYPosition,
  ) => void;
  setNode: (nodeId: string, node: MindMapNode) => void;
};

const initialNodes: MindMapNode[] = [
  {
    id: '1',
    type: 'root',
    data: { label: '운동', depth: 0 },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'summary',
    data: { label: '디자인', depth: 1, summary: '최근에 하체 운동을 했다' },
    position: { x: -300, y: 300 },
    parentId: '1',
  },
  {
    id: '3',
    type: 'summary',
    data: { label: '개발', depth: 1, summary: '등 운동을 할 계획이다' },
    position: { x: 500, y: 500 },
    parentId: '1',
  },
  {
    id: '4',
    type: 'summary',
    data: { label: '개발', depth: 1, summary: '1시간 정도 할 생각이다' },
    position: { x: 500, y: 500 },
    parentId: '3',
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
  {
    id: 'e3-4',
    source: '3',
    target: '4',
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

  addChildNode: (
    questions: string[],
    selectedNode: MindMapNode,
    position: XYPosition,
  ) => {
    const parentDepth = (selectedNode.data as MindMapNodeData)?.depth || 0;

    const newNode: MindMapNode = {
      id: nanoid(),
      type: 'question',
      data: {
        label: '다음 질문을 선택해주세요',
        depth: parentDepth + 1,
        recommendedQuestions: questions,
      },
      position,
    };

    const newEdge: MindMapEdge = {
      id: nanoid(),
      source: selectedNode.id,
      target: newNode.id,
      type: 'mindmapEdge',
    };

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
