import { useMutation } from '@tanstack/react-query';
import { gptService } from '@/services/gptService';
import { BrainStormingAnalyzeReq } from '@/types/api/gpt';

const useBrainStormingAnalyze = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: BrainStormingAnalyzeReq) =>
      gptService.generateSchedule(data),
  });

  return {
    analzeBrainStormingMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useBrainStormingAnalyze;
