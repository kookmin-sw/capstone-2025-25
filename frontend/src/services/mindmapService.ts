import { gptClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  GenerateReq,
  GeneratedScheduleRes,
  GeneratedThoughtRes,
  ConvertedToTaskReq,
  ConvertedToTaskRes,
  SummarizedNodeReq,
  SummarizedNodeRes,
} from '@/types/api/mindmap';

export const mindmapService = {
  generateSchedule: async (
    data: GenerateReq,
  ): Promise<GeneratedScheduleRes> => {
    const response = await gptClient.post<GeneratedScheduleRes>(
      ENDPOINTS.MINDMAP.GENERATE_SCHEDULE,
      data,
    );
    return response.data;
  },

  generateThought: async (data: GenerateReq): Promise<GeneratedThoughtRes> => {
    const response = await gptClient.post<GeneratedThoughtRes>(
      ENDPOINTS.MINDMAP.GENERATE_THOUGHT,
      data,
    );
    return response.data;
  },

  convertToTask: async (
    data: ConvertedToTaskReq,
  ): Promise<ConvertedToTaskRes> => {
    const response = await gptClient.post<ConvertedToTaskRes>(
      ENDPOINTS.MINDMAP.CONVERT_TO_TASK,
      data,
    );
    return response.data;
  },

  summarizeNode: async (
    data: SummarizedNodeReq,
  ): Promise<SummarizedNodeRes> => {
    const response = await gptClient.post<SummarizedNodeRes>(
      ENDPOINTS.MINDMAP.SUMMARIZE_NODE,
      data,
    );
    return response.data;
  },
};
