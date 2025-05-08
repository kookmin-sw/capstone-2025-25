import { useMutation } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';
import { GenerateReq } from '@/types/api/mindmap';

const useGenerateSchedule = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: GenerateReq) => mindmapService.generateSchedule(data),
  });

  return {
    generateScheduleMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useGenerateSchedule;
