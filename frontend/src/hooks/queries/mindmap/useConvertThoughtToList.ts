import { ConvertedToTaskReq } from '@/types/api/mindmap';
import { useMutation } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';

const useConvertThoughtToList = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: ConvertedToTaskReq) =>
      mindmapService.convertToTask(data),
  });

  return {
    convertThoughtToListMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useConvertThoughtToList;
