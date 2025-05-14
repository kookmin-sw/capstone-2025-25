import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  GetPomodoroanalysisRes,
  GetTodayTaskAnalysisRes,
} from '@/types/api/analysis';

export const analysisService = {
  getTodayTask: async (): Promise<GetTodayTaskAnalysisRes> => {
    const response = await apiClient.get<GetTodayTaskAnalysisRes>(
      ENDPOINTS.ANALYSIS.TODAY_TASK,
    );
    return response.data;
  },

  getPomodoro: async (): Promise<GetPomodoroanalysisRes> => {
    const response = await apiClient.get<GetPomodoroanalysisRes>(
      ENDPOINTS.ANALYSIS.POMODORO,
    );
    return response.data;
  },
};
