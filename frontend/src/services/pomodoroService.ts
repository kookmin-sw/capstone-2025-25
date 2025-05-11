import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { patchPomodoroReq } from '@/types/api/pomodoro';

export const pomodoroService = {
  patchPomodoro: async (data: patchPomodoroReq): Promise<void> => {
    const response = await apiClient.patch(
      ENDPOINTS.POMODORO.PATCH_POMODORO,
      data,
    );
    return response.data;
  },
};
