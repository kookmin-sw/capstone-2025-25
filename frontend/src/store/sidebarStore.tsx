import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggle: (open?: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  toggle: (open) =>
    set((state) => ({
      isOpen: typeof open === 'boolean' ? open : !state.isOpen,
    })),
}));
