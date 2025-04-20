import FlowWrapper from '@/components/reactFlow/FlowWrapper';
import useGetMindmapDetail from '@/hooks/queries/mindmap/useGetMindmapDetail';
import { parseIdParam } from '@/lib/parseIdParam';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useSetActiveMindMap } from '@/store/mindmapListStore';
import {
  useDisableSelectionMode,
  useIsNodeSelectionMode,
} from '@/store/nodeSelection';

export default function MindmapDetailPage() {
  const { id } = useParams();
  const numericId = parseIdParam(id);
  const setActiveMindMap = useSetActiveMindMap();

  const isNodeSelectionMode = useIsNodeSelectionMode();
  const disableSelectionMode = useDisableSelectionMode();

  // 마인드맵 상세 데이터 가져오기
  const { mindmapDetail } = useGetMindmapDetail(numericId);

  useEffect(() => {
    if (isNodeSelectionMode) {
      disableSelectionMode();
    }
  }, [id, isNodeSelectionMode, disableSelectionMode]);

  useEffect(() => {
    if (numericId) {
      setActiveMindMap(numericId);
    }
  }, [numericId, setActiveMindMap]);

  return (
    <div className="h-full">
      {mindmapDetail && <FlowWrapper mindmapId={mindmapDetail.id} />}
    </div>
  );
}
