import { useMutation } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';
import { ConvertedToTaskReq } from '@/types/api/mindmap';

const useConvertScheduleToTodo = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: ConvertedToTaskReq) =>
      mindmapService.convertToTask(data),
  });

  return {
    convertScheduleToTodoMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useConvertScheduleToTodo;
