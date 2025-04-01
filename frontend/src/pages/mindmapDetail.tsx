import FlowWrapper from '@/components/reactFlow/FlowWrapper';
import { useSetActiveMindMap } from '@/store/mindmapListStore';
import { useEffect } from 'react';
import { useParams } from 'react-router';

export default function MindmapDetailPage() {
  const { id } = useParams();
  const setActiveMindMap = useSetActiveMindMap();

  useEffect(() => {
    if (id) {
      setActiveMindMap(id);
    }
  }, [id, setActiveMindMap]);

  return (
    <div style={{ width: '100vw', height: '100vh' }} className="w-full h-full">
      <FlowWrapper mindmapId={id} />
    </div>
  );
}
