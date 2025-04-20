import useGetMindmapList from '@/hooks/queries/mindmap/useGetMindmapList';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export default function MindmapPage() {
  const navigate = useNavigate();
  const { mindmapList, isLoading, error } = useGetMindmapList();

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      console.error('마인드맵 목록을 불러오는데 실패했습니다:', error);
      return;
    }

    if (!mindmapList || mindmapList.length === 0) {
      return;
    }

    // 연결된 마인드맵이 있으면 그걸로 이동
    const linkedMindMaps = mindmapList.filter((mindmap) => mindmap.linked);
    if (linkedMindMaps.length > 0) {
      navigate(`/mindmap/${linkedMindMaps[0].id}`, { replace: true });
      return;
    }

    // 없으면 첫 번째 마인드맵으로 이동
    const freeMindMaps = mindmapList.filter((mindmap) => !mindmap.linked);
    if (freeMindMaps.length > 0) {
      navigate(`/mindmap/${freeMindMaps[0].id}`, { replace: true });
      return;
    }
  }, [mindmapList, isLoading, error, navigate]);

  return (
    <div className="h-full">
      <h1>마인드맵 목록</h1>
    </div>
  );
}
