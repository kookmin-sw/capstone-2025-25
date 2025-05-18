import { useQuery } from '@tanstack/react-query';
import { eisenhowerService } from '@/services/eisenhowerService';

interface UseEisenhowerAiParams {
  title: string;
  currentQuadrant: string;
  dueDate: string;
  isOpen: boolean;
}

export const useEisenhowerAiRecommendation = ({
  title,
  currentQuadrant,
  dueDate,
  isOpen,
}: UseEisenhowerAiParams) => {
  console.log(currentQuadrant, isOpen);

  const { data, isLoading, error, isPending } = useQuery({
    queryKey: ['eisenhowerAi', title, currentQuadrant, dueDate],
    queryFn: () =>
      eisenhowerService.getAiRecommendation({
        title,
        currentQuadrant,
        dueDate,
      }),
    enabled: isOpen,
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
