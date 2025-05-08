import { useQuery } from '@tanstack/react-query';
import { GetTodayTodoListRes } from '@/types/api/today/response';
import { todayService } from '@/services/todayService';

const useGetTodayTodoList = () => {
  const { data, isLoading, error, isPending } = useQuery<GetTodayTodoListRes>({
    queryKey: ['todayTodoList'],
    queryFn: () => todayService.getList(),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    todayTodoList: data?.content.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetTodayTodoList;
