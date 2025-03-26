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
    isPending?: boolean,
  ) => string;
  setNode: (nodeId: string, node: MindMapNode) => void;
  updateNodeQuestions: (
    nodeId: string,
    questions: string[],
    isPending: boolean,
  ) => void;
  deleteNode: (nodeId: string) => void;
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
    position: { x: 300, y: 300 },
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
    isPending = false,
  ) => {
    const parentDepth = (selectedNode.data as MindMapNodeData)?.depth || 0;
    const newNodeId = nanoid();

    const newNode: MindMapNode = {
      id: newNodeId,
      type: 'question',
      data: {
        label: '다음 질문을 선택해주세요',
        depth: parentDepth + 1,
        recommendedQuestions: questions,
        isPending,
      },
      position,
      parentId: selectedNode.id,
      origin: [0.5, 0.5],
    };

    const newEdge: MindMapEdge = {
      id: `e${selectedNode.id}-${newNodeId}}`,
      source: selectedNode.id,
      target: newNodeId,
      type: 'mindmapEdge',
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      edges: [...state.edges, newEdge],
    }));

    return newNodeId;
  },

  setNode: (nodeId, updatedNode) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? updatedNode : node,
      ),
    });
  },

  updateNodeQuestions: (nodeId, questions, isPending) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              recommendedQuestions: questions,
              isPending,
            },
          };
        }
        return node;
      }),
    });
  },

  deleteNode: (nodeId: string) => {
    const { nodes, edges } = get();

    const nodesToDelete = new Set<string>();

    const findChildrenRecursively = (id: string) => {
      nodesToDelete.add(id);

      const childNodes = nodes.filter((node) => node.parentId === id);

      childNodes.forEach((child) => {
        findChildrenRecursively(child.id);
      });
    };

    findChildrenRecursively(nodeId);

    const nodeIdsToDelete = Array.from(nodesToDelete);

    const edgesToKeep = edges.filter(
      (edge) =>
        !nodeIdsToDelete.includes(edge.source) &&
        !nodeIdsToDelete.includes(edge.target),
    );

    const nodesToKeep = nodes.filter((node) => !nodesToDelete.has(node.id));

    set({
      nodes: nodesToKeep,
      edges: edgesToKeep,
    });
  },
}));

export const useNodes = () => useStore((state) => state.nodes);
export const useEdges = () => useStore((state) => state.edges);
export const useNodesChange = () => useStore((state) => state.onNodesChange);
export const useEdgesChange = () => useStore((state) => state.onEdgesChange);
export const useAddChildNode = () => useStore((state) => state.addChildNode);
export const useSetNode = () => useStore((state) => state.setNode);
export const useUpdateNodeQuestions = () =>
  useStore((state) => state.updateNodeQuestions);
export const useDeleteNode = () => useStore((state) => state.deleteNode);

export default useStore;
