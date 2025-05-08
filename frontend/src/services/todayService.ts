import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { GetTodayTodoListRes } from '@/types/api/today/response';

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
};
