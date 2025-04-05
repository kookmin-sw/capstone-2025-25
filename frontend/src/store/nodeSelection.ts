import { MindMapNode } from '@/types/mindMap';
import { create } from 'zustand';

interface NodeSelectionState {
  isNodeSelectionMode: boolean;
  selectedNodes: MindMapNode[];

  toggleSelectionMode: () => void;
  addSelectedNode: (node: MindMapNode) => void;
  removeSelectedNode: (nodeId: string) => void;
  clearSelectedNodes: () => void;
  isNodeSelected: (nodeId: string) => boolean;
}

const useNodeSelectionStore = create<NodeSelectionState>((set, get) => ({
  isNodeSelectionMode: false,
  selectedNodes: [],

  toggleSelectionMode: () =>
    set((state) => ({
      isNodeSelectionMode: !state.isNodeSelectionMode,
      selectedNodes: !state.isNodeSelectionMode ? state.selectedNodes : [],
    })),

  addSelectedNode: (node) =>
    set((state) => {
      const isAlreadySelected = state.selectedNodes.some(
        (n) => n.id === node.id,
      );

      if (isAlreadySelected) {
        return state;
      }

      return {
        selectedNodes: [...state.selectedNodes, node],
      };
    }),

  removeSelectedNode: (nodeId) =>
    set((state) => ({
      selectedNodes: state.selectedNodes.filter((node) => node.id !== nodeId),
    })),

  clearSelectedNodes: () => set({ selectedNodes: [] }),

  isNodeSelected: (nodeId) => {
    return get().selectedNodes.some((node) => node.id === nodeId);
  },
}));

export const useIsNodeSelectionMode = () =>
  useNodeSelectionStore((state) => state.isNodeSelectionMode);

export const useSelectedNodes = () =>
  useNodeSelectionStore((state) => state.selectedNodes);

export const useToggleNodeSelectionMode = () =>
  useNodeSelectionStore((state) => state.toggleSelectionMode);

export const useAddSelectedNode = () =>
  useNodeSelectionStore((state) => state.addSelectedNode);

export const useRemoveSelectedNode = () =>
  useNodeSelectionStore((state) => state.removeSelectedNode);

export const useClearSelectedNodes = () =>
  useNodeSelectionStore((state) => state.clearSelectedNodes);

export const useIsNodeSelected = () =>
  useNodeSelectionStore((state) => state.isNodeSelected);
