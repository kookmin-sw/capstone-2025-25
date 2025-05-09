import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { CategoryListRes } from '@/types/api/category';

export const categoryService = {
  getList: async (): Promise<CategoryListRes> => {
    const response = await apiClient.get<CategoryListRes>(
      ENDPOINTS.CATEGORY.LIST,
    );
    return response.data;
  },
};
