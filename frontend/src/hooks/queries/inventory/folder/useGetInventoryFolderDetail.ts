import { useQuery } from '@tanstack/react-query';
import { inventoryFolderService } from '@/services/inventoryFolderService';
import { InventoryFolderDetailRes } from '@/types/api/inventory/folder/response';

const useGetInventoryFolderDetail = (id: number) => {
  const { data, isLoading, error, isPending } =
    useQuery<InventoryFolderDetailRes>({
      queryKey: ['inventoryFolderDetail', id],
      queryFn: () => inventoryFolderService.getDetail(id),
      refetchOnWindowFocus: false,
      retry: 1,
    });

  return {
    inventoryFolderDetail: data?.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetInventoryFolderDetail;
