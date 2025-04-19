import FlowWrapper from '@/components/reactFlow/FlowWrapper';
import useGetMindmapList from '@/hooks/queries/mindmap/useGetMindmapList';
import { parseIdParam } from '@/lib/parseIdParam';
import { useSetActiveMindMap } from '@/store/mindmapListStore';
import {
  useDisableSelectionMode,
  useIsNodeSelectionMode,
} from '@/store/nodeSelection';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function MindmapPage() {
  const { id } = useParams();
  const numericId = parseIdParam(id);
  const setActiveMindMap = useSetActiveMindMap();
  const navigate = useNavigate();

  const { mindmapList, isLoading, error } = useGetMindmapList();

  const isNodeSelectionMode = useIsNodeSelectionMode();
  const disableSelectionMode = useDisableSelectionMode();

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      console.error('마인드맵 목록을 불러오는데 실패했습니다:', error);
      navigate('/mindmap');
      return;
    }

    if (!mindmapList || mindmapList.length === 0) {
      navigate('/mindmap');
      return;
    }

    const isValidId =
      id && mindmapList.some((mindmap) => mindmap.id === numericId);

    if (id && isValidId) {
      setActiveMindMap(numericId);
      return;
    }

    const linkedMindMaps = mindmapList.filter((mindmap) => mindmap.linked);
    if (linkedMindMaps.length > 0) {
      navigate(`/mindmap/${linkedMindMaps[0].id}`, { replace: true });
      return;
    }

    const freeMindMaps = mindmapList.filter((mindmap) => !mindmap.linked);
    if (freeMindMaps.length > 0) {
      navigate(`/mindmap/${freeMindMaps[0].id}`, { replace: true });
      return;
    }

    // 추후 디자인 나오면 대체할 예정
    console.log('표시할 마인드맵이 없습니다');
  }, [id, mindmapList, navigate, setActiveMindMap]);

  useEffect(() => {
    if (isNodeSelectionMode) {
      disableSelectionMode();
    }
  }, [location.pathname, id]);

  return (
    <div className="h-full">{id && <FlowWrapper mindmapId={numericId} />}</div>
  );
}
