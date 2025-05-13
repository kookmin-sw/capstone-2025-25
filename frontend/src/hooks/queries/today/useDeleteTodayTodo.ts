import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todayService } from '@/services/todayService';

const useDeleteTodayTodo = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (id: number) => todayService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayTodoList'] });
      queryClient.invalidateQueries({ queryKey: ['yesterdayTodoList'] });
      queryClient.invalidateQueries({ queryKey: ['todayTodoCount'] });
      queryClient.invalidateQueries({ queryKey: ['todayTodoCompletedCount'] });
    },
  });

  return {
    deleteTodayTodoMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useDeleteTodayTodo;
