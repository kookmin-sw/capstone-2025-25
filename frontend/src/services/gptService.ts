import { gptClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  BrainStormingAnalyzeReq,
  BrainStormingAnalyzeRes,
} from '@/types/api/gpt';

export const gptService = {
  generateSchedule: async (
    data: BrainStormingAnalyzeReq,
  ): Promise<BrainStormingAnalyzeRes> => {
    const response = await gptClient.post<BrainStormingAnalyzeRes>(
      ENDPOINTS.GPT.BRAINSTORMING.ANALYZE,
      data,
    );
    return response.data;
  },
};
