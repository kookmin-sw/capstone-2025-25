import { useQuery } from '@tanstack/react-query';
import { inventoryFolderService } from '@/services/inventoryFolderService';
import { InventoryFolderListRes } from '@/types/api/inventory/folder/response';

const useGetInventoryFolderList = () => {
  const { data, isLoading, error, isPending } =
    useQuery<InventoryFolderListRes>({
      queryKey: ['inventoryFolderList'],
      queryFn: () => inventoryFolderService.getList(),
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
