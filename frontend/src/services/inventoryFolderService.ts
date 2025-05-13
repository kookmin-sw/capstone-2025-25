import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { CreateInvertoryFolderCreateReq } from '@/types/api/inventory/folder';
import {
  InventoryFolderDetailRes,
  InventoryFolderListRes,
} from '@/types/api/inventory/folder/response';

export const inventoryFolderService = {
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

  getDetail: async (id: number): Promise<InventoryFolderDetailRes> => {
    const response = await apiClient.get<InventoryFolderDetailRes>(
      ENDPOINTS.INVENTORY.FOLDER.DETAIL(id),
    );
    return response.data;
  },

  updateName: async (id: number, data: { name: string }) => {
    const res = await apiClient.patch(
      ENDPOINTS.INVENTORY.FOLDER.UPDATE_NAME(id),
      data,
    );
    return res.data;
  },
};
