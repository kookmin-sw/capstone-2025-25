import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todayService } from '@/services/todayService';

const useMoveToday = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (id: number) => todayService.moveToday(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayTodoList'] });
      queryClient.invalidateQueries({ queryKey: ['yesterdayTodoList'] });
      queryClient.invalidateQueries({ queryKey: ['todayTodoCount'] });
      queryClient.invalidateQueries({ queryKey: ['todayTodoCompletedCount'] });
    },
  });

  return {
    moveTodayMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useMoveToday;
