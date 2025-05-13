import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryFolderService } from '@/services/inventoryFolderService';

const useUpdateFolderName = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string } }) =>
      inventoryFolderService.updateName(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryFolderList'] });
    },
  });

  return {
    updateFolderNameMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useUpdateFolderName;
