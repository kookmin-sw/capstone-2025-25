export type InventoryFolder = {
  id: number;
  name: string;
  itemCount: number;
  isDefault: boolean;
};

export type InventoryItem = {
  id: number;
  folderId: number;
  title: string;
  memo: string;
  createdAt: string;
};
