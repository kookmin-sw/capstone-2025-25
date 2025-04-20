import { apiClient, gptClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  GenerateReq,
  GeneratedScheduleRes,
  GeneratedThoughtRes,
  ConvertedToTaskReq,
  ConvertedToTaskRes,
  SummarizedNodeReq,
  SummarizedNodeRes,
  CreateRootNodeReq,
  CreateRootNodeRes,
  GetMindmapListRes,
  GetMindmapDetailRes,
  DeleteMindmapRes,
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

  createRootNode: async (
    data: CreateRootNodeReq,
  ): Promise<CreateRootNodeRes> => {
    const response = await apiClient.post<CreateRootNodeRes>(
      ENDPOINTS.MINDMAP.CREATE_ROOT_NODE,
      data,
    );
    return response.data;
  },

  getList: async (): Promise<GetMindmapListRes> => {
    const response = await apiClient.get<GetMindmapListRes>(
      ENDPOINTS.MINDMAP.GET_LIST,
    );
    return response.data;
  },

  getDetail: async (id: number): Promise<GetMindmapDetailRes> => {
    const response = await apiClient.get<GetMindmapDetailRes>(
      ENDPOINTS.MINDMAP.DETAIL(id),
    );
    return response.data;
  },

  delete: async (id: number): Promise<DeleteMindmapRes> => {
    const response = await apiClient.delete<DeleteMindmapRes>(
      ENDPOINTS.MINDMAP.DETAIL(id),
    );
    return response.data;
  },
};
