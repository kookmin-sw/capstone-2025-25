'use client';

import MindmapSubSidebar from '@/components/ui/sidebar/panel/MindmapSubSidebar';
import PomodoroSubSidebar from '@/components/ui/sidebar/panel/PomodoroSubSidebar.tsx';

const panelComponents = {
  mindmap: MindmapSubSidebar,
  pomodoro: PomodoroSubSidebar,
};

type SidebarPanelProps = {
  activeId: string;
};

export default function SubSidebar({ activeId }: SidebarPanelProps) {
  const PanelComponent =
    panelComponents[activeId as keyof typeof panelComponents];

  return PanelComponent ? <PanelComponent /> : null;
}
