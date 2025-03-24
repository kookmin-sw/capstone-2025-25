import { useMutation } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';
import { GeneratedScheduleReq } from '@/types/api/mindmap';

const useGenerateSchedule = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: GeneratedScheduleReq) =>
      mindmapService.generateSchedule(data),
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
