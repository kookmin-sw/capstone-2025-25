import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryItemService } from '@/services/inventoryItemService';
import { UpdateInventoryItemReq } from '@/types/api/inventory/item';

const useUpdateInventoryItem = (id: number) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: ({ data }: { data: UpdateInventoryItemReq }) =>
      inventoryItemService.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItemList', id] });
    },
  });

  return {
    updateInventoryItemMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useUpdateInventoryItem;
