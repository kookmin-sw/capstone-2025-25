import { apiClient, gptClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type {
  GetTaskDetailRes,
  GetTaskListRes,
  EisenhowerAiRecommendationReq,
  EisenhowerAiRecommendationRes,
} from '@/types/api/eisenhower';
import { Task } from '@/types/task.ts';

export const eisenhowerService = {
  create: async (payload: {
    title: string;
    categoryId?: number | null;
    dueDate?: string | null;
    memo?: string | null;
    quadrant: string;
    order: number;
  }) => {
    const res = await apiClient.post(ENDPOINTS.EISENHOWER.CREATE, payload);
    return res.data;
  },
  getList: async (): Promise<GetTaskListRes> => {
    const res = await apiClient.get<GetTaskListRes>('/api/v1/eisenhower');
    return res.data;
  },
  getDetail: async (id: number): Promise<GetTaskDetailRes> => {
    const response = await apiClient.get<GetTaskDetailRes>(
      ENDPOINTS.EISENHOWER.GET_ONE(id),
    );
    return response.data;
  },
  update: async (taskId: number, task: Partial<Task>) => {
    const payload = {
      title: task.title,
      categoryId: task.categoryId ?? null,
      dueDate: task.dueDate ?? null,
      memo: task.memo,
      isCompleted: task.isCompleted ?? false,
      dueDateExplicitlyNull: task.dueDate === null,
      categoryExplicitlyNull: task.categoryId === null,
    };
    const res = await apiClient.patch(`/api/v1/eisenhower/${taskId}`, payload);
    return res.data;
  },
  updateOrder: async (
    items: { eisenhowerItemId: number; quadrant: string; order: number }[],
  ) => {
    const res = await apiClient.patch('/api/v1/eisenhower/order', { items });
    return res.data;
  },

  delete: async (taskId: number) => {
    const res = await apiClient.delete(`/api/v1/eisenhower/${taskId}`);
    return res.data;
  },

  getAiRecommendation: async (
    data: EisenhowerAiRecommendationReq,
  ): Promise<EisenhowerAiRecommendationRes> => {
    const res = await gptClient.post<EisenhowerAiRecommendationRes>(
      ENDPOINTS.GPT.EISENHOWER.RECOMMEND,
      data,
    );
    return res.data;
  },
};
