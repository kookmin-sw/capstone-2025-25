import { useQuery } from '@tanstack/react-query';
import { GetNotificationRes } from '@/types/api/eisenhower';
import { eisenhowerService } from '@/services/eisenhowerService';

const getDateBasedCacheKey = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

const useGetNotification = () => {
  const { data, isLoading, error, isPending } = useQuery<GetNotificationRes>({
    queryKey: ['notification', getDateBasedCacheKey()],
    queryFn: () => eisenhowerService.getNotification(),
    staleTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    notifications: data?.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetNotification;
