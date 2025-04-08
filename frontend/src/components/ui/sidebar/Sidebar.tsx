'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Network, LayoutDashboard, Grid2x2, TimerReset } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

import SidebarPanel from '@/components/ui/sidebar/panel/SidebarPanel';

const navItems = [
  {
    id: 'todayList',
    icon: <LayoutDashboard size={24} />,
    label: '오늘의 할 일',
    route: '/today',
  },
  {
    id: 'matrix',
    icon: <Grid2x2 size={24} />,
    label: '매트릭스',
    route: '/matrix',
  },
  {
    id: 'mindmap',
    icon: <Network size={24} className="rotate-[-90deg]" />,
    label: '마인드맵',
    route: '/mindmap',
  },
  {
    id: 'pomodoro',
    icon: <TimerReset size={24} />,
    label: '뽀모도로',
    route: '/pomodoro',
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [panelVisible, setPanelVisible] = useState(true);

  const activeId =
    navItems.find((item) => location.pathname.includes(item.route))?.id || null;

  const handleNavClick = (route: string) => {
    setPanelVisible(true);
    navigate(route);
  };

  const handlePanelClose = () => setPanelVisible(false);

  return (
    <div className="flex h-screen">
      <aside className="w-[250px] bg-white border-r border-gray-300 px-[22px] py-[20px]">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">★</span>
          </div>
          <span className="text-lg font-semibold">Flowin</span>
        </div>

        <div className="overflow-hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.route)}
              className={cn(
                'flex items-center w-full px-4 py-3 gap-2 text-left transition rounded-md cursor-pointer',
                activeId === item.id
                  ? 'bg-[#8F5AFF] text-white font-semibold'
                  : 'text-black hover:bg-gray-50',
              )}
            >
              <div>{item.icon}</div>
              <p>{item.label}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Panel 영역 */}
      {panelVisible && activeId && (
        <SidebarPanel activeId={activeId} onClose={handlePanelClose} />
      )}

      {/* 콘텐츠 영역 */}
      <div className="flex-1 bg-gray-50"></div>
    </div>
  );
}
