import { useMutation } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';
import { CreateRootNodeReq } from '@/types/api/mindmap';

const useCreateRootNode = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: CreateRootNodeReq) =>
      mindmapService.createRootNode(data),
  });

  return {
    createRootNodeMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useCreateRootNode;
