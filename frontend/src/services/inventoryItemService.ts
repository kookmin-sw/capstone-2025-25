import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { InventoryItemListRes } from '@/types/api/inventory/item';

export const inventoryItemService = {
  getList: async (id: number): Promise<InventoryItemListRes> => {
    const response = await apiClient.get<InventoryItemListRes>(
      ENDPOINTS.INVENTORY.ITEM.LIST(id),
    );
    return response.data;
  },
};
