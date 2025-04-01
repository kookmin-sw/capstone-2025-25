import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';
import { MindMapNode, MindMap, TodoType } from '@/types/mindMap';

export type MindMapListState = {
  mindMaps: MindMap[];
  activeMindMapId: string | null;

  createMindMap: (
    title: string,
    type: TodoType,
    isConnected?: boolean,
  ) => string;
  loadMindMapData: (id: string) => MindMap | null;
};

const useStore = create<MindMapListState>((set, get) => ({
  mindMaps: [],
  activeMindMapId: null,

  createMindMap: (title, type) => {
    const id = nanoid();

    const newMindMap: MindMap = {
      id,
      title,
      type,
    };

    set((state) => ({
      mindMaps: [...state.mindMaps, newMindMap],
      activeMindMapId: id,
    }));

    return id;
  },

  loadMindMapData: (id) => {
    const storedData = localStorage.getItem(`mindmap-data-${id}`);
    if (storedData) {
      return JSON.parse(storedData) as MindMap;
    }
    return null;
  },
}));

export const useMindMaps = () => useStore((state) => state.mindMaps);
export const useActiveMindMapId = () =>
  useStore((state) => state.activeMindMapId);
export const useCreateMindMap = () => useStore((state) => state.createMindMap);
export const useLoadMindMapData = () =>
  useStore((state) => state.loadMindMapData);

export default useStore;
