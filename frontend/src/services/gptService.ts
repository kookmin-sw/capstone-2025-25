import { gptClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  BrainStormingAnalyzeReq,
  BrainStormingAnalyzeRes,
  BrainStormingRewriteReq,
  BrainStormingRewriteRes,
  MergeBubbleReq,
  MergeBubbleRes,
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
  mergeBubble: async (data: MergeBubbleReq): Promise<MergeBubbleRes> => {
    const response = await gptClient.post<MergeBubbleRes>(
      ENDPOINTS.GPT.BRAINSTORMING.MERGE,
      data,
    );
    return response.data;
  },
};
