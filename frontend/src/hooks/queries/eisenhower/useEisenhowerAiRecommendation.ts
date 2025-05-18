import { useQuery } from '@tanstack/react-query';
import { eisenhowerService } from '@/services/eisenhowerService';

interface UseEisenhowerAiParams {
  title: string;
  currentQuadrant: string;
  dueDate: string;
}

export const useEisenhowerAiRecommendation = ({
  title,
  currentQuadrant,
  dueDate,
}: UseEisenhowerAiParams) => {
  const { data, isLoading, error, isPending } = useQuery({
    queryKey: ['eisenhowerAi', title, currentQuadrant, dueDate],
    queryFn: () =>
      eisenhowerService.getAiRecommendation({
        title,
        currentQuadrant,
        dueDate,
      }),
    enabled: !!title && !!dueDate && !!currentQuadrant,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    recommendation: data,
    isLoading,
    error,
    isPending,
  };
};
