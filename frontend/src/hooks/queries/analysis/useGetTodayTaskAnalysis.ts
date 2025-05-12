import { useQuery } from '@tanstack/react-query';
import { GetTodayTaskAnalysisRes } from '@/types/api/analysis';
import { analysisService } from '@/services/analysisService';

const useGetTodayTaskAnalysis = () => {
  const { data, isLoading, error, isPending } =
    useQuery<GetTodayTaskAnalysisRes>({
      queryKey: ['todayTaskAnalysis'],
      queryFn: () => analysisService.getList(),
      refetchOnWindowFocus: false,
      retry: 1,
    });

  return {
    todayTaskAnalysisList: data?.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetTodayTaskAnalysis;
