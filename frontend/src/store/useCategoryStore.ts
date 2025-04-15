import { create } from 'zustand';
import type { Category } from '@/types/category';
import { categoryThemes } from '@/utils/category';

interface CategoryStore {
  categories: Category[];
  fetchCategories: () => void;
  addCategory: (title: string) => void;
  removeCategory: (id: number) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  fetchCategories: () =>
    set({
      categories: [
        {
          id: 1,
          title: '일정',
          color: '#D9ECFF',
          textColor: '#4A90E2',
        },
        {
          id: 2,
          title: '공부',
          color: '#FDE4EF',
          textColor: '#E86CA5',
        },
        {
          id: 3,
          title: '개인',
          color: '#FCE1C6',
          textColor: '#F28C38',
        },
        {
          id: 4,
          title: '팀플',
          color: '#FEF3C7',
          textColor: '#FBBF24',
        },
        {
          id: 5,
          title: '기타',
          color: '#E5E5E5',
          textColor: '#6B7280',
        },
      ],
    }),
  addCategory: (title) =>
    set((state) => {
      const random =
        categoryThemes[Math.floor(Math.random() * categoryThemes.length)];
      return {
        categories: [
          ...state.categories,
          {
            id: Date.now(),
            title,
            color: random.bg,
            textColor: random.text,
          },
        ],
      };
    }),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
}));
