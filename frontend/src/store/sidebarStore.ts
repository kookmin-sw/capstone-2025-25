import { create } from 'zustand';

type SidebarState = {
  panelVisible: boolean;
  setPanelVisible: (visible: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  panelVisible: false,
  setPanelVisible: (visible) => set({ panelVisible: visible }),
}));
