import {
  EdgeChange,
  NodeChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
} from '@xyflow/react';
import { create } from 'zustand';
import { MindMapEdge, MindMapNode, MindMapNodeData } from '@/types/mindMap';
import { filterNodesAndEdges, findChildNodes } from '@/lib/mindMap';
import { generateStringId } from '@/lib/generateNumericId';

type ActiveState = {
  nodeId: string;
  previousNodes: MindMapNode[];
  previousEdges: MindMapEdge[];
  previousActiveState: ActiveState | null;
};

export type RFState = {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  activeState: ActiveState | null;

  onNodesChange: (
    changes: NodeChange[],
    saveMindMapData?: (
      id: number,
      nodes: MindMapNode[],
      edges: MindMapEdge[],
    ) => void,
    activeMindMapId?: number | null,
  ) => void;

  onEdgesChange: (
    changes: EdgeChange[],
    saveMindMapData?: (
      id: number,
      nodes: MindMapNode[],
      edges: MindMapEdge[],
    ) => void,
    activeMindMapId?: number | null,
  ) => void;
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
  setInitialData: (nodes: MindMapNode[], edges: MindMapEdge[]) => void;
  restoreActiveState: () => void;
};

const initialNodes: MindMapNode[] = [];
const initialEdges: MindMapEdge[] = [];

const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  activeState: null,

  onNodesChange: (changes, saveMindMapData, activeMindMapId) => {
    const updatedNodes = applyNodeChanges(
      changes,
      get().nodes,
    ) as MindMapNode[];

    set({ nodes: updatedNodes });

    if (saveMindMapData && activeMindMapId) {
      saveMindMapData(activeMindMapId, updatedNodes, get().edges);
    }
  },

  onEdgesChange: (changes, saveMindMapData, activeMindMapId) => {
    const updatedEdges = applyEdgeChanges(changes, get().edges);

    set({ edges: updatedEdges });

    if (saveMindMapData && activeMindMapId) {
      saveMindMapData(activeMindMapId, get().nodes, updatedEdges);
    }
  },

  addChildNode: (
    selectedNode: MindMapNode,
    position: XYPosition,
    isPending = false,
  ) => {
    const parentDepth = (selectedNode.data as MindMapNodeData)?.depth || 0;
    const newNodeId = generateStringId();

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

    const currentNodes = [...get().nodes];
    const currentEdges = [...get().edges];

    set((state) => ({
      nodes: [...state.nodes, newNode],
      edges: [...state.edges, newEdge],
      activeState: {
        nodeId: newNodeId,
        previousNodes: currentNodes,
        previousEdges: currentEdges,
        previousActiveState: state.activeState,
      },
    }));

    return newNodeId;
  },

  setNode: (nodeId, updatedNode) => {
    const currentNodes = [...get().nodes];
    const currentEdges = [...get().edges];

    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? updatedNode : node,
      ),
      activeState: {
        nodeId: nodeId,
        previousNodes: currentNodes,
        previousEdges: currentEdges,
        previousActiveState: state.activeState,
      },
    }));
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
          type: 'summary' as const,
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
  setInitialData: (nodes, edges) => {
    set({
      nodes: nodes,
      edges: edges,
    });
  },

  restoreActiveState: () => {
    const { activeState } = get();
    if (activeState) {
      set({
        nodes: activeState.previousNodes,
        edges: activeState.previousEdges,
        activeState: activeState.previousActiveState,
      });
    }
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
export const useSetInitialData = () =>
  useStore((state) => state.setInitialData);
export const useActiveState = () => useStore((state) => state.activeState);
export const useRestoreActiveState = () =>
  useStore((state) => state.restoreActiveState);

export default useStore;
