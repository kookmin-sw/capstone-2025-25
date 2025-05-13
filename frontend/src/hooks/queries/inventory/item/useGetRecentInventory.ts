import { useQuery } from '@tanstack/react-query';
import { inventoryItemService } from '@/services/inventoryItemService';
import { InventoryRecentListRes } from '@/types/api/inventory/item';

const useGetRecentInventory = () => {
  const { data, isLoading, error, isPending } =
    useQuery<InventoryRecentListRes>({
      queryKey: ['recentInventoryList'],
      queryFn: () => inventoryItemService.getRecentList(),
      refetchOnWindowFocus: false,
      retry: 1,
    });

  return {
    inventoryRecentList: data?.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetRecentInventory;
