import { create } from 'zustand';
import type { Category } from '@/types/category';

interface CategoryStore {
  categories: Category[];
  fetchCategories: () => void;
  addCategory: (category: Category) => void;
  removeCategory: (id: number) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  fetchCategories: () =>
    set({
      categories: [
        { id: 1, name: '작업' },
        { id: 2, name: '공부' },
        { id: 3, name: '개인' },
        { id: 4, name: '팀플' },
        { id: 5, name: '기타' },
      ],
    }),
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
}));
