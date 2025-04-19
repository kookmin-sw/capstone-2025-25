import { useQuery } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';
import { GetMindmapListRes } from '@/types/api/mindmap';
import { useSetMindMaps } from '@/store/mindmapListStore';
import { useEffect } from 'react';

const useGetMindmapList = () => {
  const setMindMaps = useSetMindMaps();

  const { data, isLoading, error, isPending } = useQuery<GetMindmapListRes>({
    queryKey: ['mindmapList'],
    queryFn: () => mindmapService.getList(),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (data?.content) {
      setMindMaps(data.content);
    }
  }, [data?.content, setMindMaps]);

  return {
    mindmapList: data?.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetMindmapList;
