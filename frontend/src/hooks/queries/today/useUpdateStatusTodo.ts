import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todayService } from '@/services/todayService';

const useUpdateStatusTodo = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { isCompleted: boolean };
    }) => todayService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayTodoList'] });
      queryClient.invalidateQueries({ queryKey: ['yesterdayTodoList'] });
      queryClient.invalidateQueries({ queryKey: ['todayTodoCount'] });
      queryClient.invalidateQueries({ queryKey: ['todayTodoCompletedCount'] });
    },
  });

  return {
    updateStatusMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useUpdateStatusTodo;
