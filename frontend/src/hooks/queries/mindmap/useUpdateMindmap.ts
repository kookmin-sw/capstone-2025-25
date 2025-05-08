import { useMutation } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';
import { UpdateMindmapReq } from '@/types/api/mindmap';

const useUpdateMindmap = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMindmapReq }) =>
      mindmapService.update(id, data),
  });

  return {
    updateMindmapMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useUpdateMindmap;
