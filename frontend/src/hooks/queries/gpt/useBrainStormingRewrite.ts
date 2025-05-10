import { useMutation } from '@tanstack/react-query';
import { gptService } from '@/services/gptService';
import { BrainStormingRewriteReq } from '@/types/api/gpt';

const useBrainStormingRewrite = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: BrainStormingRewriteReq) =>
      gptService.rewriteBrainStorming(data),
  });

  return {
    rewriteBrainStormingMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useBrainStormingRewrite;
