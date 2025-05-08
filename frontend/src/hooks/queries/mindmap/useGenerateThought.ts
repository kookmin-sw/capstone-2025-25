import { useMutation } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';
import { GenerateReq } from '@/types/api/mindmap';

const useGenerateThought = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: GenerateReq) => mindmapService.generateThought(data),
  });

  return {
    generateThoughtMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useGenerateThought;
