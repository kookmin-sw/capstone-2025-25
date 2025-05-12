import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryItemService } from '@/services/inventoryItemService';

const useDeleteInventoryItem = (folderId: number) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (id: number) => inventoryItemService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['inventoryItemList', folderId],
      });
    },
  });

  return {
    deleteInventoryItemMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useDeleteInventoryItem;
