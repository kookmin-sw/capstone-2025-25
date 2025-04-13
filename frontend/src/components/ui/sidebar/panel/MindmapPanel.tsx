import { useState } from 'react';
import CommonPanelWrapper from './CommonPanelWrapper';
import { ChevronUp, Link, Unlink } from 'lucide-react';
import MindmapCard from '@/components/ui/sidebar/panel/mindmap/MindmapCard';
import MindmapAddButton from '@/components/ui/sidebar/panel/mindmap/MindmapAddButton';
import { useMindMaps } from '@/store/mindmapListStore';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

export default function MindmapPanel() {
  const [openSections, setOpenSections] = useState({
    connected: false,
    free: true,
  });

  const mindMaps = useMindMaps();

  return (
    <CommonPanelWrapper title="마인드맵" addButton={<MindmapAddButton />}>
      {/* 연결된 마인드맵 */}
      <Collapsible
        open={openSections.connected}
        onOpenChange={(open) =>
          setOpenSections((prev) => ({ ...prev, connected: open }))
        }
        className="w-full mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Link size={22} /> 연결된 마인드맵
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="p-0 h-8 w-8">
              <ChevronUp
                className={`h-[20px] w-[20px] transition-transform duration-200 ${
                  openSections.connected ? '' : 'rotate-180'
                }`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down mt-2">
          <div className="space-y-4">
            {/* 연결된 마인드맵 목록 */}
            {/* 아직 연결된 마인드맵이 없음 */}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 자유로운 마인드맵 */}
      <Collapsible
        open={openSections.free}
        onOpenChange={(open) =>
          setOpenSections((prev) => ({ ...prev, free: open }))
        }
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Unlink size={22} /> 자유로운 마인드맵
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="p-0 h-8 w-8">
              <ChevronUp
                className={`h-[20px] w-[20px] transition-transform duration-200 ${
                  openSections.free ? '' : 'rotate-180'
                }`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down mt-2">
          <div className="space-y-4">
            {mindMaps.map((mindmap) => (
              <MindmapCard key={mindmap.id} mindmap={mindmap} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </CommonPanelWrapper>
  );
}
