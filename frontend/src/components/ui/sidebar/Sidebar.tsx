'use client';

import { cn } from '@/lib/utils';
import {
  Network,
  LayoutDashboard,
  Grid2x2,
  TimerReset,
  ChevronsRight,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

import { useSidebarStore } from '@/store/sidebarStore';
import SubSidebar from '@/components/ui/sidebar/subSidebar/SubSidebar';

const navItems = [
  {
    id: 'todayList',
    icon: <LayoutDashboard size={24} />,
    label: '오늘의 할 일',
    route: '/today',
    hasPanel: false,
  },
  {
    id: 'matrix',
    icon: <Grid2x2 size={24} />,
    label: '매트릭스',
    route: '/matrix',
    hasPanel: false,
  },
  {
    id: 'mindmap',
    icon: <Network size={24} className="rotate-[-90deg]" />,
    label: '마인드맵',
    route: '/mindmap',
    hasPanel: true,
  },
  {
    id: 'pomodoro',
    icon: <TimerReset size={24} />,
    label: '뽀모도로',
    route: '/pomodoro',
    hasPanel: true,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { panelVisible, setPanelVisible } = useSidebarStore();

  const activeItem =
    navItems.find((item) => location.pathname.includes(item.route)) || null;
  const activeId = activeItem?.id || null;
  const activeItemHasPanel = activeItem?.hasPanel || false;

  const handleNavItemClick = (e: React.MouseEvent, route: string) => {
    const target = e.target as HTMLElement;
    const isChevronButton = target.closest('.panel-toggle-button');

    if (isChevronButton) {
      setPanelVisible(true);
      return;
    }

    navigate(route);
  };

  return (
    <div className="flex h-screen">
      <div className="flex h-full relative">
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
                onClick={(e) => handleNavItemClick(e, item.route)}
                className={cn(
                  'flex items-center w-full px-4 py-3 gap-2 text-left transition rounded-md cursor-pointer relative group',
                  activeId === item.id
                    ? 'bg-[#8F5AFF] text-white font-semibold'
                    : 'text-black hover:bg-gray-50',
                )}
              >
                <div>{item.icon}</div>
                <p>{item.label}</p>

                {item.hasPanel && activeId === item.id && !panelVisible && (
                  <div className="panel-toggle-button absolute right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-100 p-1 hover:bg-white/10 rounded-full cursor-pointer">
                    <ChevronsRight size={18} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </aside>

        {activeItemHasPanel && (
          <div
            className={cn(
              'h-full bg-white border-r border-gray-300 transition-all duration-300 ease-in-out overflow-hidden',
              panelVisible ? 'w-[300px] opacity-100' : 'w-0 opacity-0',
            )}
          >
            {activeId && <SubSidebar activeId={activeId} />}
          </div>
        )}
      </div>
    </div>
  );
}
