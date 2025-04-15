import { useMutation } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';
import { ConvertedThoughtListReq } from '@/types/api/mindmap';

const useConvertThoughtToList = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: ConvertedThoughtListReq) =>
      mindmapService.convertThoughtToList(data),
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
