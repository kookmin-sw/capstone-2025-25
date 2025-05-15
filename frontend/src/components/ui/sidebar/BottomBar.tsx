import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router';

import TodayTodoIcon from '@/assets/sidebar/color-today-todo.svg';
import TodayTodoHWIcon from '@/assets/sidebar/bw-today-todo.svg';
import BrainStormingIcon from '@/assets/sidebar/color-brainstorming.svg';
import BrainStormingHWIcon from '@/assets/sidebar/bw-brainstorming.svg';
import EisenHowerIcon from '@/assets/sidebar/color-eisenhower.svg';
import EisenHowerHWIcon from '@/assets/sidebar/bw-eisenhower.svg';
import StoreIcon from '@/assets/sidebar/color-store.svg';
import StoreHWIcon from '@/assets/sidebar/bw-store.svg';

type NavItem = {
  id: string;
  activeIcon: string | React.ReactNode;
  defaultIcon: string | React.ReactNode;
  label: string;
  route: string;
  activePatterns?: string[];
  externalLink?: string;
};

const navItems: NavItem[] = [
  {
    id: 'today-todo',
    activeIcon: TodayTodoIcon,
    defaultIcon: TodayTodoHWIcon,
    label: '오늘의 할 일',
    route: '/today/',
  },
  {
    id: 'brainstorming',
    activeIcon: BrainStormingIcon,
    defaultIcon: BrainStormingHWIcon,
    label: '브레인스토밍',
    route: '/brainstorming/',
    activePatterns: ['/mindmap/'],
  },
  {
    id: 'matrix',
    activeIcon: EisenHowerIcon,
    defaultIcon: EisenHowerHWIcon,
    label: '아이젠하워',
    route: '/matrix/',
  },
  {
    id: 'store',
    activeIcon: StoreIcon,
    defaultIcon: StoreHWIcon,
    label: '보관함',
    route: '/inventory/',
    activePatterns: ['/inventory/'],
  },
];

export default function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item: NavItem): boolean => {
    if (location.pathname === item.route) {
      return true;
    }

    if (location.pathname === item.route?.slice(0, -1)) {
      return true;
    }

    if (item.activePatterns) {
      return item.activePatterns.some((pattern) => {
        return location.pathname.startsWith(pattern);
      });
    }

    return false;
  };

  const handleItemClick = (item: NavItem): void => {
    if (item.externalLink) {
      window.open(item.externalLink, '_blank');
    } else {
      navigate(item.route);
    }
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item);
    const isIconComponent = typeof item.activeIcon !== 'string';

    return (
      <button
        key={item.id}
        onClick={() => handleItemClick(item)}
        className={cn(
          'flex flex-col items-center justify-center flex-1 py-2 px-1 cursor-pointer',
          active ? 'text-blue-500' : 'text-gray-400',
        )}
      >
        <div className="flex items-center justify-center w-6 h-6 relative mb-1">
          {isIconComponent ? (
            <>
              <div
                className={cn(
                  'transition-opacity duration-300',
                  active ? 'opacity-100' : 'opacity-0',
                )}
              >
                {item.activeIcon}
              </div>
              <div
                className={cn(
                  'absolute inset-0 transition-opacity duration-300',
                  !active ? 'opacity-100' : 'opacity-0',
                )}
              >
                {item.defaultIcon}
              </div>
            </>
          ) : (
            <>
              <img
                src={item.activeIcon as string}
                alt={item.label}
                className={cn(
                  'w-6 h-6 absolute transition-opacity duration-300',
                  active ? 'opacity-100' : 'opacity-0',
                )}
              />
              <img
                src={item.defaultIcon as string}
                alt={item.label}
                className={cn(
                  'w-6 h-6 absolute transition-opacity duration-300',
                  !active ? 'opacity-100' : 'opacity-0',
                )}
              />
            </>
          )}
        </div>
        <span className="text-xs font-medium whitespace-nowrap">
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-scale-200 border-t border-white shadow-[0_-4px_24px_0_#ffffff] z-10">
      <div className="flex items-center justify-between h-16 px-2">
        {navItems.map((item) => renderNavItem(item))}
      </div>
    </div>
  );
}
