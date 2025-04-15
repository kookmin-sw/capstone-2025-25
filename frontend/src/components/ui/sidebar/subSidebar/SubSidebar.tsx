'use client';

import MindmapSubSidebar from '@/components/ui/sidebar/subSidebar/mindmap/MindmapSubSidebar';
import PomodoroSubSidebar from '@/components/ui/sidebar/subSidebar/pomodoro/PomodoroSubSidebar';

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
