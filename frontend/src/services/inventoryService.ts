import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { GetInventoryFolderListRes } from '@/types/api/inventory';

export const inventoryService = {
  getList: async (): Promise<GetInventoryFolderListRes> => {
    const response = await apiClient.get<GetInventoryFolderListRes>(
      ENDPOINTS.INVENTORY.FOLDER.LIST,
    );
    return response.data;
  },
};
