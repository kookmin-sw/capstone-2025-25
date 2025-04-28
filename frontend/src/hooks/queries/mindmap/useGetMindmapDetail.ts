import { useQuery } from '@tanstack/react-query';
import { mindmapService } from '@/services/mindmapService';
import { GetMindmapDetailRes } from '@/types/api/mindmap';
import { useEffect } from 'react';
import { useSetInitialData } from '@/store/mindMapStore';

const useGetMindmapDetail = (id: number) => {
  const setInitialData = useSetInitialData();

  const { data, isLoading, error, isPending } = useQuery<GetMindmapDetailRes>({
    queryKey: ['mindmapDetail', id],
    queryFn: () => mindmapService.getDetail(id),
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!id,
  });

  useEffect(() => {
    if (data?.content) {
      setInitialData(data.content.nodes, data.content.edges);
    }
  }, [data?.content, setInitialData]);

  return {
    mindmapDetail: data?.content,
    isLoading,
    error,
    isPending,
  };
};

export default useGetMindmapDetail;
