import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  CreateInvertoryFolderCreateReq,
  InventoryFolderListRes,
} from '@/types/api/inventory';

export const inventoryService = {
  getList: async (): Promise<InventoryFolderListRes> => {
    const response = await apiClient.get<InventoryFolderListRes>(
      ENDPOINTS.INVENTORY.FOLDER.LIST,
    );
    return response.data;
  },

  create: async (data: CreateInvertoryFolderCreateReq) => {
    const res = await apiClient.post<CreateInvertoryFolderCreateReq>(
      ENDPOINTS.INVENTORY.FOLDER.CREATE,
      data,
    );
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete(
      ENDPOINTS.INVENTORY.FOLDER.DELETE(id),
    );
    return response.data;
  },
};
