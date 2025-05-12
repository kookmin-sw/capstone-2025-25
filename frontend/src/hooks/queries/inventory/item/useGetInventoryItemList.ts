import { useQuery } from '@tanstack/react-query';
import { inventoryItemService } from '@/services/inventoryItemService';
import { InventoryItemListRes } from '@/types/api/inventory/item';

const useGetInventoryItemList = (id: number) => {
  const { data, isLoading, error, isPending } = useQuery<InventoryItemListRes>({
    queryKey: ['inventoryItemList', id],
    queryFn: () => inventoryItemService.getList(id),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    inventoryItemList: data?.content.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetInventoryItemList;
