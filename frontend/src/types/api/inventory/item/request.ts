export type UpdateInventoryItemReq = {
  title: string;
  memo: string;
};

export type MoveInventoryItemReq = {
  folderId: number;
};

export type CreateInventoryItemReq = {
  folderId: number;
  title: string;
  memo: string;
};
