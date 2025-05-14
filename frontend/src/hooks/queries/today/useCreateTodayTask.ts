import { useMutation } from '@tanstack/react-query';
import { todayService } from '@/services/todayService';

const useCreateTodayTask = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (id: number) => todayService.createTodayTask(id),
  });

  return {
    createTodoTaskMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useCreateTodayTask;
