'use client';

import MindmapPanel from '@/components/ui/sidebar/panel/MindmapPanel.tsx';
import PomodoroSubSidebar from '@/components/ui/sidebar/panel/PomodoroSubSidebar.tsx';

const panelComponents = {
  mindmap: MindmapPanel,
  pomodoro: PomodoroSubSidebar,
};

type SidebarPanelProps = {
  activeId: string;
};

export default function SidebarPanel({ activeId }: SidebarPanelProps) {
  const PanelComponent =
    panelComponents[activeId as keyof typeof panelComponents];

  return PanelComponent ? <PanelComponent /> : null;
}
