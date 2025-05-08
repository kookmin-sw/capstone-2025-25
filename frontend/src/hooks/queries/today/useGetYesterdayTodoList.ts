import { useQuery } from '@tanstack/react-query';
import { GetTodayTodoListRes } from '@/types/api/today/response';
import { todayService } from '@/services/todayService';

const useGetYesterdayTodoList = () => {
  const { data, isLoading, error, isPending } = useQuery<GetTodayTodoListRes>({
    queryKey: ['yesterdayTodoList'],
    queryFn: () => todayService.getYesterdayList(),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    yesterdayTodoList: data?.content.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetYesterdayTodoList;
