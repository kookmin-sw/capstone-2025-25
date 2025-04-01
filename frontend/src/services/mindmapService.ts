import { gptClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  GeneratedScheduleReq,
  GeneratedScheduleRes,
  GeneratedThoughtReq,
  GeneratedThoughtRes,
  ConvertedScheduleTodoReq,
  ConvertedScheduleTodoRes,
  ConvertedThoughtListReq,
  ConvertedThoughtListRes,
  SummarizedNodeReq,
  SummarizedNodeRes,
} from '@/types/api/mindmap';

export const mindmapService = {
  generateSchedule: async (
    data: GeneratedScheduleReq,
  ): Promise<GeneratedScheduleRes> => {
    const response = await gptClient.post<GeneratedScheduleRes>(
      ENDPOINTS.MINDMAP.GENERATE_SCHEDULE,
      data,
    );
    return response.data;
  },

  generateThought: async (
    data: GeneratedThoughtReq,
  ): Promise<GeneratedThoughtRes> => {
    const response = await gptClient.post<GeneratedThoughtRes>(
      ENDPOINTS.MINDMAP.GENERATE_THOUGHT,
      data,
    );
    return response.data;
  },

  convertScheduleToTodo: async (
    data: ConvertedScheduleTodoReq,
  ): Promise<ConvertedScheduleTodoRes> => {
    const response = await gptClient.post<ConvertedScheduleTodoRes>(
      ENDPOINTS.MINDMAP.CONVERT_SCHEDULE_TODO,
      data,
    );
    return response.data;
  },

  convertThoughtToList: async (
    data: ConvertedThoughtListReq,
  ): Promise<ConvertedThoughtListRes> => {
    const response = await gptClient.post<ConvertedThoughtListRes>(
      ENDPOINTS.MINDMAP.CONVERT_THOUGHT_LIST,
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
