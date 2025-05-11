import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventoryService';
import { CreateInvertoryFolderCreateReq } from '@/types/api/inventory';

const useCreateInventoryFolder = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: CreateInvertoryFolderCreateReq) =>
      inventoryService.create(data),
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
