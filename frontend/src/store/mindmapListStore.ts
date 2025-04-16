import { create } from 'zustand';
import { MindMapNode, MindMap, TodoType, MindMapEdge } from '@/types/mindMap';
import { mockMindMaps } from '@/mock/mindmap';
import { Task } from '@/types/task';
import { generateNumericId } from '@/lib/generateNumericId';

export type MindMapListState = {
  mindMaps: MindMap[];
  activeMindMapId: string | null;

  createMindMap: (title: string, type: TodoType) => string;
  createLinkedMindMap: (task: Task) => string;
  loadMindMapData: (id: string) => MindMap | null;
  setActiveMindMap: (id: string | null) => void;
  saveMindMapData: (
    id: string,
    nodes: MindMapNode[],
    edges: MindMapEdge[],
  ) => void;
  deleteMindMap: (id: string) => void;
  disconnectMindmapTask: (mindMapId: string | number) => void;
};

const useStore = create<MindMapListState>((set, get) => ({
  mindMaps: mockMindMaps,
  activeMindMapId: null,

  createMindMap: (title, type) => {
    const id = generateNumericId();

    const initialNodes: MindMapNode[] = [
      {
        id: generateNumericId(),
        type: 'root',
        data: { label: title, depth: 0 },
        position: { x: 0, y: 0 },
      },
    ];

    const newMindMap: MindMap = {
      id,
      title,
      type,
      lastModifiedAt: new Date().toISOString(),
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

  createLinkedMindMap: (task) => {
    const id = generateNumericId();

    const { title, type } = task;

    const initialNodes: MindMapNode[] = [
      {
        id: generateNumericId(),
        type: 'root',
        data: { label: title, depth: 0 },
        position: { x: 0, y: 0 },
      },
    ];

    const newMindMap: MindMap = {
      id,
      title,
      type,
      lastModifiedAt: new Date().toISOString(),
      nodes: initialNodes,
      edges: [],
      linked: true,
      eisenhowerItemDTO: task,
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

  deleteMindMap: (id) => {
    const { mindMaps, activeMindMapId } = get();
    const updatedMindMaps = mindMaps.filter((mindMap) => mindMap.id !== id);

    const newActiveMindMapId = activeMindMapId === id ? null : activeMindMapId;

    set({
      mindMaps: updatedMindMaps,
      activeMindMapId: newActiveMindMapId,
    });
  },

  disconnectMindmapTask: (mindMapId) => {
    const mindMapIndex = get().mindMaps.findIndex((m) => m.id === mindMapId);

    if (mindMapIndex !== -1) {
      const updatedMindMaps = [...get().mindMaps];
      updatedMindMaps[mindMapIndex] = {
        ...updatedMindMaps[mindMapIndex],
        linked: false,
        eisenhowerItemDTO: undefined,
      };

      set({ mindMaps: updatedMindMaps });
    }
  },
}));

export const useMindMaps = () => useStore((state) => state.mindMaps);
export const useActiveMindMapId = () =>
  useStore((state) => state.activeMindMapId);
export const useCreateMindMap = () => useStore((state) => state.createMindMap);
export const useCreateLinkedMindMap = () =>
  useStore((state) => state.createLinkedMindMap);

export const useLoadMindMapData = () =>
  useStore((state) => state.loadMindMapData);
export const useSetActiveMindMap = () =>
  useStore((state) => state.setActiveMindMap);
export const useSaveMindMapData = () =>
  useStore((state) => state.saveMindMapData);
export const useDeleteMindMap = () => useStore((state) => state.deleteMindMap);
export const useDisconnectMindmapTask = () =>
  useStore((state) => state.disconnectMindmapTask);

export default useStore;
