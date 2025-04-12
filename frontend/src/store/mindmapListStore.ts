import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';
import { MindMapNode, MindMap, TodoType, MindMapEdge } from '@/types/mindMap';
import { mockMindMaps } from '@/mock/mindmap';

export type MindMapListState = {
  mindMaps: MindMap[];
  activeMindMapId: string | null;

  createMindMap: (title: string, type: TodoType) => string;
  loadMindMapData: (id: string) => MindMap | null;
  setActiveMindMap: (id: string | null) => void;
  saveMindMapData: (
    id: string,
    nodes: MindMapNode[],
    edges: MindMapEdge[],
  ) => void;
};

const useStore = create<MindMapListState>((set, get) => ({
  mindMaps: mockMindMaps,
  activeMindMapId: null,

  createMindMap: (title, type) => {
    const id = nanoid();

    const initialNodes: MindMapNode[] = [
      {
        id: '1',
        type: 'root',
        data: { label: title, depth: 0 },
        position: { x: 0, y: 0 },
      },
    ];

    const newMindMap: MindMap = {
      id,
      title,
      type,
      nodes: initialNodes,
      edges: [],
      linked: false,
    };

    set((state) => ({
      mindMaps: [...state.mindMaps, newMindMap],
      activeMindMapId: id,
    }));

    return id;
  },

  loadMindMapData: (id) => {
    const mindMap = get().mindMaps.find((m) => m.id === id);
    return mindMap || null;
  },

  setActiveMindMap: (id) => {
    set({ activeMindMapId: id });
  },

  saveMindMapData: (id, nodes, edges) => {
    const mindMapIndex = get().mindMaps.findIndex((m) => m.id === id);

    if (mindMapIndex !== -1) {
      const updatedMindMaps = [...get().mindMaps];
      updatedMindMaps[mindMapIndex] = {
        ...updatedMindMaps[mindMapIndex],
        nodes,
        edges,
      };

      set({ mindMaps: updatedMindMaps });
    }
  },
}));

export const useMindMaps = () => useStore((state) => state.mindMaps);
export const useActiveMindMapId = () =>
  useStore((state) => state.activeMindMapId);
export const useCreateMindMap = () => useStore((state) => state.createMindMap);
export const useLoadMindMapData = () =>
  useStore((state) => state.loadMindMapData);
export const useSetActiveMindMap = () =>
  useStore((state) => state.setActiveMindMap);
export const useSaveMindMapData = () =>
  useStore((state) => state.saveMindMapData);

export default useStore;
