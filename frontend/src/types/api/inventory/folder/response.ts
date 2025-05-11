import { InventoryFolder } from '@/types/inventory';

export type InventoryFolderListRes = {
  error: string | null;
  statusCode: number;
  content: InventoryFolder[];
};
export type InventoryFolderDetailRes = {
  error: string | null;
  statusCode: number;
  content: InventoryFolder;
};
