import { useQuery } from '@tanstack/react-query';
import { InventoryFolderListRes } from '@/types/api/inventory';
import { inventoryService } from '@/services/inventoryService';

const useGetInventoryFolderList = () => {
  const { data, isLoading, error, isPending } =
    useQuery<InventoryFolderListRes>({
      queryKey: ['inventoryFolderList'],
      queryFn: () => inventoryService.getList(),
      refetchOnWindowFocus: false,
      retry: 1,
    });

  return {
    inventoryFolderList: data?.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetInventoryFolderList;
