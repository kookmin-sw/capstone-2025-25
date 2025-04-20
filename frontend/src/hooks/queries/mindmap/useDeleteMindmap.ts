import { useMutation } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';

const useDeleteMindmap = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (id: number) => mindmapService.delete(id),
  });

  return {
    deleteMindmapMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useDeleteMindmap;
