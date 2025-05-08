import { useQuery } from '@tanstack/react-query';
import { brainstormingService } from '@/services/brainstormingService.ts';
import { CreatedBubblesRes } from '@/types/api/brainstorming';

const useGetBubbles = () => {
  const { data, isLoading, error, isPending } = useQuery<CreatedBubblesRes>({
    queryKey: ['bubbleList'],
    queryFn: () => brainstormingService.getBubbles(),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    bubbleList: data?.content ?? [],
    isLoading,
    error,
    isPending,
  };
};

export default useGetBubbles;
