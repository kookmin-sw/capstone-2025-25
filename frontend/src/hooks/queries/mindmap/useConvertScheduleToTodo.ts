import { useMutation } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';
import { ConvertedScheduleTodoReq } from '@/types/api/mindmap';

const useConvertScheduleToTodo = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (data: ConvertedScheduleTodoReq) =>
      mindmapService.convertScheduleToTodo(data),
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
