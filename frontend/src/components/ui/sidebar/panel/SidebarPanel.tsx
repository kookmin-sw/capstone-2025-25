'use client';

import MindmapPanel from '@/components/ui/sidebar/panel/MindmapPanel.tsx';
import PomodoroPanel from '@/components/ui/sidebar/panel/PomodoroPanel.tsx';

const panelComponents = {
  mindmap: MindmapPanel,
  pomodoro: PomodoroPanel,
};

type SidebarPanelProps = {
  activeId: string;
};

export default function SidebarPanel({ activeId }: SidebarPanelProps) {
  const PanelComponent =
    panelComponents[activeId as keyof typeof panelComponents];

  return PanelComponent ? <PanelComponent /> : null;
}
