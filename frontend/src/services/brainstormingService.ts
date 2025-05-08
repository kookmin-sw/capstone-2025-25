import { apiClient, gptClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { CreateBubbleReq, CreatedBubblesRes } from '@/types/api/brainstorming';

export const brainstormingService = {
  getBubbles: async (): Promise<CreatedBubblesRes> => {
    const response = await apiClient.get<CreatedBubblesRes>(
      ENDPOINTS.BRAINSTORMING.GET_BUBBLES,
    );
    return response.data;
  },

  createBubble: async (data: CreateBubbleReq): Promise<CreatedBubblesRes> => {
    const response = await gptClient.post<CreatedBubblesRes>(
      ENDPOINTS.BRAINSTORMING.CREATE_BUBBLE,
      data,
    );
    return response.data;
  },
  deleteBubble: async (id: number): Promise<void> => {
    const response = await gptClient.delete(
      ENDPOINTS.BRAINSTORMING.DELETE_BUBBLE(id),
    );
    return response.data;
  },
};
