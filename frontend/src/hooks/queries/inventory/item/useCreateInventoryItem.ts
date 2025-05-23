import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryItemService } from '@/services/inventoryItemService';
import { CreateInventoryItemReq } from '@/types/api/inventory/item';

const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateInventoryItemReq }) =>
      inventoryItemService.createItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bubbleList'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryFolderList'] });
    },
  });

  return {
    createInventoryItemMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useCreateInventoryItem;
