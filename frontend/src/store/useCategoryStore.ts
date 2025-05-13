import { create } from 'zustand';
import type { Category } from '@/types/category';
import { eisenhowerCategoryService } from '@/services/eisenhowerCategoryService';

const colorPalette = [
  { bgColor: '#E8EFFF', textColor: '#4A90E2' },
  { bgColor: '#FDF1E6', textColor: '#F2994A' },
  { bgColor: '#FDEDED', textColor: '#EB5757' },
  { bgColor: '#F1F8EC', textColor: '#6FCF97' },
  { bgColor: '#EAF4FB', textColor: '#2D9CDB' },
];

interface CategoryStore {
  categories: Category[];
  fetchCategories: () => Promise<void>;
  addCategory: (title: string) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],

  fetchCategories: async () => {
    try {
      const res = await eisenhowerCategoryService.getList();
      set({ categories: res.content });
    } catch (err) {
      console.error('카테고리 목록 불러오기 실패:', err);
    }
  },

  addCategory: async (title) => {
    try {
      // 랜덤 색상 선택
      const randomColor =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];

      const res = await eisenhowerCategoryService.create({
        title,
        color: randomColor.bgColor,
      });

      const newCategory: Category = {
        ...res.content,
        color: randomColor.bgColor,
        textColor: randomColor.textColor,
      };

      set((state) => ({
        categories: [...state.categories, newCategory],
      }));
    } catch (err) {
      console.error('카테고리 추가 실패:', err);
    }
  },

  removeCategory: async (id) => {
    try {
      await eisenhowerCategoryService.delete(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (err) {
      console.error('카테고리 삭제 실패:', err);
    }
  },
}));
