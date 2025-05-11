import { InventoryFolder } from '@/types/inventory';

export type GetInventoryFolderListRes = {
  error: string | null;
  statusCode: number;
  content: InventoryFolder[];
};
