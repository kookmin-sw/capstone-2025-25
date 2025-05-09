import { useQuery } from '@tanstack/react-query';
import { GetTodayCountRes } from '@/types/api/today/response';
import { todayService } from '@/services/todayService';

const useGetTodayTodoCount = () => {
  const { data, isLoading, error, isPending } = useQuery<GetTodayCountRes>({
    queryKey: ['todayTodoCount'],
    queryFn: () => todayService.getCount(),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    todayTodoCount: data?.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetTodayTodoCount;
