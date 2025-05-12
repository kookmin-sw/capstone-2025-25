import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { GetTodayTaskAnalysisRes } from '@/types/api/analysis';

export const analysisService = {
  getList: async (): Promise<GetTodayTaskAnalysisRes> => {
    const response = await apiClient.get<GetTodayTaskAnalysisRes>(
      ENDPOINTS.ANALYSIS.TODAY_TASK,
    );
    return response.data;
  },
};
