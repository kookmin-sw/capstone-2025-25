import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';

type CategoryPayload = { title: string; color: string };

export const eisenhowerCategoryService = {
  getList: async () => {
    const res = await apiClient.get(ENDPOINTS.EISENHOWER_CATEGORY.GET_ALL);
    return res.data;
  },

  create: async (payload: CategoryPayload) => {
    const res = await apiClient.post(
      ENDPOINTS.EISENHOWER_CATEGORY.CREATE,
      payload,
    );
    return res.data;
  },

  update: async (categoryId: number, payload: CategoryPayload) => {
    const res = await apiClient.patch(
      ENDPOINTS.EISENHOWER_CATEGORY.UPDATE(categoryId),
      payload,
    );
    return res.data;
  },

  delete: async (categoryId: number) => {
    const res = await apiClient.delete(
      ENDPOINTS.EISENHOWER_CATEGORY.DELETE(categoryId),
    );
    return res.data;
  },
};
