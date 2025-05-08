import { Link, Unlink } from 'lucide-react';
import MindmapCard from '@/components/ui/sidebar/subSidebar/mindmap/MindmapCard';
import MindmapAddButton from '@/components/ui/sidebar/subSidebar/mindmap/MindmapAddButton';
import { useMindMaps } from '@/store/mindmapListStore';

import { SubSidebarAccordion } from '@/components/ui/SubSidebarAccordion';
import CommonSubSidebarWrapper from '@/components/ui/sidebar/subSidebar/CommonSubSidebarWrapper';
import { useParams } from 'react-router';
import { parseIdParam } from '@/lib/parseIdParam';

export default function MindmapSubSidebar() {
  const mindMaps = useMindMaps();

  const connectedMindMaps = mindMaps.filter((mindmap) => mindmap.linked);
  const freeMindMaps = mindMaps.filter((mindmap) => !mindmap.linked);

  const { id } = useParams<{ id: string }>();
  const numericId = parseIdParam(id);

  return (
    <CommonSubSidebarWrapper title="마인드맵" addButton={<MindmapAddButton />}>
      <div className="flex flex-col gap-5">
        <SubSidebarAccordion
          value=" linked"
          icon={<Link className=" w-4 h-4" />}
          title=" 연결된 마인드맵"
        >
          <div className=" space-y-2">
            {connectedMindMaps.map((mindmap) => (
              <MindmapCard
                key={mindmap.id}
                mindmap={mindmap}
                selected={numericId === mindmap.id}
              />
            ))}
          </div>
        </SubSidebarAccordion>

        <SubSidebarAccordion
          value=" unlinked"
          icon={<Unlink className=" w-4 h-4" />}
          title=" 자유로운 마인드맵"
        >
          <div className=" space-y-2">
            {freeMindMaps.map((mindmap) => (
              <MindmapCard
                key={mindmap.id}
                mindmap={mindmap}
                selected={numericId === mindmap.id}
              />
            ))}
          </div>
        </SubSidebarAccordion>
      </div>
    </CommonSubSidebarWrapper>
  );
}
