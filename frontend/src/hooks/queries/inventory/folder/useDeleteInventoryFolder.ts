import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryFolderService } from '@/services/inventoryFolderService';

const useDeleteInventoryFolder = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (id: number) => inventoryFolderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryFolderList'] });
    },
  });

  return {
    deleteInventoryFolderMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useDeleteInventoryFolder;
