import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateInvertoryFolderCreateReq } from '@/types/api/inventory/folder';
import { inventoryFolderService } from '@/services/inventoryFolderService';

const useCreateInventoryFolder = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: CreateInvertoryFolderCreateReq) =>
      inventoryFolderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryFolderList'] });
    },
  });

  return {
    createInventoryFolderMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useCreateInventoryFolder;
