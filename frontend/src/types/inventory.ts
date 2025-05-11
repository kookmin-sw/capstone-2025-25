export type InventoryFolder = {
  id: number;
  name: string;
  itemCount: number;
};

export type InventoryItem = {
  id: number;
  folderId: number;
  title: string;
  memo: string;
  createdAt: string;
};
