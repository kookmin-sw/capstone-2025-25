import { gptClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  BrainStormingAnalyzeReq,
  BrainStormingAnalyzeRes,
  BrainStormingRewriteReq,
  BrainStormingRewriteRes,
} from '@/types/api/gpt';

export const gptService = {
  analyzeBrainStorming: async (
    data: BrainStormingAnalyzeReq,
  ): Promise<BrainStormingAnalyzeRes> => {
    const response = await gptClient.post<BrainStormingAnalyzeRes>(
      ENDPOINTS.GPT.BRAINSTORMING.ANALYZE,
      data,
    );
    return response.data;
  },

  rewriteBrainStorming: async (
    data: BrainStormingRewriteReq,
  ): Promise<BrainStormingRewriteRes> => {
    const response = await gptClient.post<BrainStormingRewriteRes>(
      ENDPOINTS.GPT.BRAINSTORMING.REWRITE,
      data,
    );
    return response.data;
  },
};
