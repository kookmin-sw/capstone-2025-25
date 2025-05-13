import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  CreateBubbleReq,
  CreatedBubblesRes,
  PatchBubbleReq,
  CreateMatrixReq,
} from '@/types/api/brainstorming';

export const brainstormingService = {
  getBubbles: async (): Promise<CreatedBubblesRes> => {
    const response = await apiClient.get<CreatedBubblesRes>(
      ENDPOINTS.BRAINSTORMING.GET_BUBBLES,
    );
    return response.data;
  },

  createBubble: async (data: CreateBubbleReq): Promise<CreatedBubblesRes> => {
    const response = await apiClient.post<CreatedBubblesRes>(
      ENDPOINTS.BRAINSTORMING.CREATE_BUBBLE,
      data,
    );
    return response.data;
  },
  deleteBubble: async (id: number): Promise<void> => {
    const response = await apiClient.delete(
      ENDPOINTS.BRAINSTORMING.DELETE_BUBBLE(id),
    );
    return response.data;
  },
  patchBubble: async (id: number, data: PatchBubbleReq): Promise<void> => {
    const response = await apiClient.patch(
      ENDPOINTS.BRAINSTORMING.PATCH_BUBBLE(id),
      data,
    );
    return response.data;
  },

  createMatrix: async (id: number, data: CreateMatrixReq): Promise<void> => {
    const response = await apiClient.post(
      `/api/v2/bubble/confirm-eisenhower/${id}`,
      data,
    );
    return response.data;
  },
};
