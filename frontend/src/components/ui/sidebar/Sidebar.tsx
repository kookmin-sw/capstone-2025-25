'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Network, ListTodo, LayoutDashboard, Timer } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

import MindmapPanel from '@/components/ui/sidebar/panel/MindmapPanel.tsx';
import TodayListPanel from '@/components/ui/sidebar/panel/TodayListPanel.tsx';
import PomodoroPanel from '@/components/ui/sidebar/panel/PomodoroPanel.tsx';

const navItems = [
  {
    id: 'today-list',
    icon: <LayoutDashboard size={18} />,
    label: '오늘의 할 일',
    route: '/today-list',
  },
  {
    id: 'matrix',
    icon: <ListTodo size={18} />,
    label: '매트릭스',
    route: '/matrix',
  },
  {
    id: 'mindmap',
    icon: <Network size={18} />,
    label: '마인드맵',
    route: '/mindmap',
  },
  {
    id: 'pomodoro',
    icon: <Timer size={18} />,
    label: '뽀모도로',
    route: '/pomodoro',
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelVisible, setPanelVisible] = useState(true);

  useEffect(() => {
    const matched = navItems.find((item) =>
      location.pathname.includes(item.route),
    );
    if (matched) setActiveId(matched.id);
  }, [location.pathname]);

  const handleNavClick = (id: string, route: string) => {
    setActiveId(id);
    setPanelVisible(true);
    navigate(route);
  };

  const renderPanel = () => {
    if (!panelVisible || !activeId) return null;
    const onClose = () => setPanelVisible(false);
    switch (activeId) {
      case 'mindmap':
        return <MindmapPanel onClose={onClose} />;
      case 'today-list':
        return <TodayListPanel onClose={onClose} />;
      case 'matrix':
        return;
      case 'pomodoro':
        return <PomodoroPanel onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* 사이드바 */}
      <aside className="w-[250px] bg-white border-r px-4 py-6">
        {/* 로고 */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">★</span>
          </div>
          <span className="text-lg font-semibold">Flowin</span>
        </div>
        {/* 메뉴 */}
        <div className="overflow-hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.route)}
              className={cn(
                'flex items-center w-full px-4 py-3 text-sm gap-2 text-left transition rounded-md cursor-pointer',
                activeId === item.id
                  ? 'bg-[#8F5AFF] text-white font-semibold'
                  : 'text-black hover:bg-gray-50',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      {renderPanel()}

      {/* 콘텐츠 영역 */}
      <div className="flex-1 bg-gray-50"></div>
    </div>
  );
}
