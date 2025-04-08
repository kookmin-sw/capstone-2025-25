'use client';

import MindmapPanel from '@/components/ui/sidebar/panel/MindmapPanel.tsx';
import TodayListPanel from '@/components/ui/sidebar/panel/TodayListPanel.tsx';
import MatrixPanel from '@/components/ui/sidebar/panel/MatrixPanel.tsx';
import PomodoroPanel from '@/components/ui/sidebar/panel/PomodoroPanel.tsx';

const panelComponents = {
  mindmap: MindmapPanel,
  todayList: TodayListPanel,
  matrix: MatrixPanel,
  pomodoro: PomodoroPanel,
};

type SidebarPanelProps = {
  activeId: string;
  onClose: () => void;
};

export default function SidebarPanel({ activeId, onClose }: SidebarPanelProps) {
  const PanelComponent =
    panelComponents[activeId as keyof typeof panelComponents];

  return PanelComponent ? <PanelComponent onClose={onClose} /> : null;
}
