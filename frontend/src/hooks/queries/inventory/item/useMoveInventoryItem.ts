import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryItemService } from '@/services/inventoryItemService';
import { MoveInventoryItemReq } from '@/types/api/inventory/item';

const useMoveInventoryItem = (folderId: number) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: MoveInventoryItemReq }) =>
      inventoryItemService.moveFolder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['inventoryItemList', folderId],
      });
      queryClient.invalidateQueries({
        queryKey: ['inventoryFolderList'],
      });
    },
  });

  return {
    moveInventoryItemMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useMoveInventoryItem;
