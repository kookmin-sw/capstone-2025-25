import { create } from 'zustand';

interface UseCategoryStore {
  categories: string[];
  addCategory: (cat: string) => void;
  removeCategory: (cat: string) => void;
}

export const useCategoryStore = create<UseCategoryStore>((set) => ({
  categories: ['study', 'work', 'personal', 'etc'],
  addCategory: (cat) =>
    set((state) => ({
      categories: [...state.categories, cat],
    })),
  removeCategory: (cat) =>
    set((state) => ({
      categories: state.categories.filter((c) => c !== cat),
    })),
}));
