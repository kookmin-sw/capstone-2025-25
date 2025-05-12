import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import {
  InventoryItemListRes,
  MoveInventoryItemReq,
  UpdateInventoryItemReq,
} from '@/types/api/inventory/item';

export const inventoryItemService = {
  getList: async (id: number): Promise<InventoryItemListRes> => {
    const response = await apiClient.get<InventoryItemListRes>(
      ENDPOINTS.INVENTORY.ITEM.LIST(id),
    );
    return response.data;
  },

  updateItem: async (
    id: number,
    data: UpdateInventoryItemReq,
  ): Promise<void> => {
    const response = await apiClient.patch(
      ENDPOINTS.INVENTORY.ITEM.UPDATE_ITEM(id),
      data,
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete(
      ENDPOINTS.INVENTORY.ITEM.DELETE(id),
    );
    return response.data;
  },
  moveFolder: async (id: number, data: MoveInventoryItemReq): Promise<void> => {
    const response = await apiClient.patch(
      ENDPOINTS.INVENTORY.ITEM.MOVE_FOLDER(id),
      data,
    );
    return response.data;
  },
};
