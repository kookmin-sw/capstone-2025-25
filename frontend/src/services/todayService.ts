import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  GetTodayCountRes,
  GetTodayTodoListRes,
  MoveTodayRes,
} from '@/types/api/today/response';

export const todayService = {
  getList: async (): Promise<GetTodayTodoListRes> => {
    const response = await apiClient.get<GetTodayTodoListRes>(
      ENDPOINTS.TODAY.LIST,
    );
    return response.data;
  },

  getYesterdayList: async (): Promise<GetTodayTodoListRes> => {
    const response = await apiClient.get<GetTodayTodoListRes>(
      ENDPOINTS.TODAY.YESTERDAY_LIST,
    );
    return response.data;
  },

  getCount: async (): Promise<GetTodayCountRes> => {
    const response = await apiClient.get<GetTodayCountRes>(
      ENDPOINTS.TODAY.GET_COUNT,
    );
    return response.data;
  },

  getCompletedCount: async (): Promise<GetTodayCountRes> => {
    const response = await apiClient.get<GetTodayCountRes>(
      ENDPOINTS.TODAY.COMPLETE_COUNT,
    );
    return response.data;
  },

  moveToday: async (id: number): Promise<MoveTodayRes> => {
    const response = await apiClient.post<MoveTodayRes>(
      ENDPOINTS.TODAY.MOVE_TODAY(id),
    );
    return response.data;
  },

  updateStatus: async (
    id: number,
    data: { isCompleted: boolean },
  ): Promise<void> => {
    const response = await apiClient.patch(
      ENDPOINTS.TODAY.UPDATE_STATUS(id),
      data,
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete(ENDPOINTS.TODAY.DELETE(id));
    return response.data;
  },
};
