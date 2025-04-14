import FlowWrapper from '@/components/reactFlow/FlowWrapper';
import { useMindMaps, useSetActiveMindMap } from '@/store/mindmapListStore';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function MindmapPage() {
  const { id } = useParams();
  const setActiveMindMap = useSetActiveMindMap();
  const mindMaps = useMindMaps();
  const navigate = useNavigate();

  useEffect(() => {
    if (mindMaps.length === 0) {
      navigate('/mindmap');
      return;
    }

    const isValidId = id && mindMaps.some((mindmap) => mindmap.id === id);

    if (id && isValidId) {
      setActiveMindMap(id);
      return;
    }

    const linkedMindMaps = mindMaps.filter((mindmap) => mindmap.linked);
    if (linkedMindMaps.length > 0) {
      navigate(`/mindmap/${linkedMindMaps[0].id}`, { replace: true });
      return;
    }

    const freeMindMaps = mindMaps.filter((mindmap) => !mindmap.linked);
    if (freeMindMaps.length > 0) {
      navigate(`/mindmap/${freeMindMaps[0].id}`, { replace: true });
      return;
    }

    // 추후 디자인 나오면 대체할 예정
    console.log('표시할 마인드맵이 없습니다');
  }, [id, mindMaps, navigate, setActiveMindMap]);

  return (
    <div className="h-full">
      {id && <FlowWrapper mindmapId={id} />}
    </div>
  );
}
