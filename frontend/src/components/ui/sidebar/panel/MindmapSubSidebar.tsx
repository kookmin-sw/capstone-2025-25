import { Link, Unlink } from 'lucide-react';
import MindmapCard from '@/components/ui/sidebar/panel/mindmap/MindmapCard';
import MindmapAddButton from '@/components/ui/sidebar/panel/mindmap/MindmapAddButton';
import { useMindMaps } from '@/store/mindmapListStore';

import { SubSidebarAccordion } from '@/components/ui/SubSidebarAccordion';
import CommonSubSidebarWrapper from '@/components/ui/sidebar/panel/CommonSubSidebarWrapper';

export default function MindmapSubSidebar() {
  const mindMaps = useMindMaps();

  const connectedMindMaps = mindMaps.filter((mindmap) => mindmap.linked);
  const freeMindMaps = mindMaps.filter((mindmap) => !mindmap.linked);

  return (
    <CommonSubSidebarWrapper title="마인드맵" addButton={<MindmapAddButton />}>
      <SubSidebarAccordion
        value="linked"
        icon={<Link className="w-4 h-4" />}
        title="연결된 마인드맵"
      >
        <div className="space-y-4">
          {connectedMindMaps.map((mindmap) => (
            <MindmapCard key={mindmap.id} mindmap={mindmap} />
          ))}
        </div>
      </SubSidebarAccordion>

      <SubSidebarAccordion
        value="unlinked"
        icon={<Unlink className="w-4 h-4" />}
        title="자유로운 마인드맵"
      >
        <div className="space-y-4">
          {freeMindMaps.map((mindmap) => (
            <MindmapCard key={mindmap.id} mindmap={mindmap} />
          ))}
        </div>
      </SubSidebarAccordion>
    </CommonSubSidebarWrapper>
  );
}
