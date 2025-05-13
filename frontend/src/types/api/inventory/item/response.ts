import { InventoryItem } from '@/types/inventory';

export type InventoryItemListRes = {
  statusCode: number;
  error: string | null;
  content: {
    content: InventoryItem[];
  };
};

export type InventoryRecentListRes = {
  statusCode: number;
  error: string | null;
  content: InventoryItem[];
};
