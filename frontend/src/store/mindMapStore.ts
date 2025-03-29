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
import {
  filterNodesAndEdges,
  findChildNodes,
  findParentNode,
} from '@/lib/mindMap';

export type RFState = {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addChildNode: (
    selectedNode: MindMapNode,
    position: XYPosition,
    isPending?: boolean,
  ) => string;
  setNode: (nodeId: string, node: MindMapNode) => void;
  updateNodeQuestions: (nodeId: string, questions: string[]) => void;
  updateNodePending: (nodeId: string, isPending: boolean) => void;
  deleteNode: (nodeId: string) => void;
  updateNode: (nodeId: string, answer: string, summary: string) => void;
};

const initialNodes: MindMapNode[] = [
  {
    id: '1',
    type: 'root',
    data: { label: '운동', depth: 0 },
    position: { x: 0, y: 0 },
  },
];

const initialEdges: MindMapEdge[] = [];

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
        recommendedQuestions: [],
        isPending,
      },
      position,
    };

    const newEdge: MindMapEdge = {
      id: `e${selectedNode.id}-${newNodeId}`,
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

  updateNodeQuestions: (nodeId, questions) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              recommendedQuestions: questions,
            },
          };
        }
        return node;
      }),
    });
  },

  updateNodePending: (nodeId, isPending) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              isPending,
            },
          };
        }
        return node;
      }),
    });
  },
  deleteNode: (nodeId) => {
    const { nodes, edges } = get();

    const nodesToDelete = findChildNodes(edges, nodeId, true);

    const { filteredNodes, filteredEdges } = filterNodesAndEdges(
      nodes,
      edges,
      nodesToDelete,
    );

    set({
      nodes: filteredNodes,
      edges: filteredEdges,
    });
  },

  updateNode: (nodeId, answer, summary) => {
    const { nodes, edges } = get();
    const nodesToDelete = findChildNodes(edges, nodeId, false);

    const { filteredNodes, filteredEdges } = filterNodesAndEdges(
      nodes,
      edges,
      nodesToDelete,
    );

    const updatedNodes = filteredNodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          type: 'summary',
          data: {
            ...node.data,
            answer,
            summary,
          },
        };
      }
      return node;
    });

    set({
      nodes: updatedNodes,
      edges: filteredEdges,
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
export const useUpdateNodePending = () =>
  useStore((state) => state.updateNodePending);
export const useDeleteNode = () => useStore((state) => state.deleteNode);
export const useUpdateNode = () => useStore((state) => state.updateNode);

export default useStore;
