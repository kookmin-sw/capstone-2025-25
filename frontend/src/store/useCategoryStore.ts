import { create } from 'zustand';
import type { Category } from '@/types/category';
import { eisenhowerCategoryService } from '@/services/eisenhowerCategoryService';

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
      const bgColor = '#E8EFFF';
      const textColor = '#4A90E2';

      const res = await eisenhowerCategoryService.create({
        title,
        color: bgColor,
      });

      const newCategory: Category = {
        ...res.content, // API 응답 (id, title 포함된 객체)
        color: bgColor,
        textColor: textColor,
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
