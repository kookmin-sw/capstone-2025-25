import { useMutation } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';
import { SummarizedNodeReq } from '@/types/api/mindmap';

const useSummarizeNode = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: SummarizedNodeReq) => mindmapService.summarizeNode(data),
  });

  return {
    summarizeNodeMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useSummarizeNode;
