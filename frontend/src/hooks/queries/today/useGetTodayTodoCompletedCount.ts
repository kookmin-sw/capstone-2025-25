import { useQuery } from '@tanstack/react-query';
import { GetTodayCountRes } from '@/types/api/today/response';
import { todayService } from '@/services/todayService';

const useGetTodayTodoCompletedCount = () => {
  const { data, isLoading, error, isPending } = useQuery<GetTodayCountRes>({
    queryKey: ['todayTodoCompletedCount'],
    queryFn: () => todayService.getCompletedCount(),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    todayTodoCompletedCount: data?.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetTodayTodoCompletedCount;
