import { useQuery } from '@tanstack/react-query';
import { GetPomodoroanalysisRes } from '@/types/api/analysis';
import { analysisService } from '@/services/analysisService';

const useGetPomodoroAnalysis = () => {
  const { data, isLoading, error, isPending } =
    useQuery<GetPomodoroanalysisRes>({
      queryKey: ['pomodoroAnalysis'],
      queryFn: () => analysisService.getPomodoro(),
      refetchOnWindowFocus: false,
      retry: 1,
    });

  return {
    pomodoroAnalysisList: data?.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetPomodoroAnalysis;
