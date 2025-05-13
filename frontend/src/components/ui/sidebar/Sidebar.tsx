import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Info, Settings } from 'lucide-react';

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
    route: '/today',
  },
  {
    id: 'brainstorming',
    activeIcon: BrainStormingIcon,
    defaultIcon: BrainStormingHWIcon,
    label: '브레인스토밍',
    route: '/brainstorming',
    activePatterns: ['/mindmap'],
  },
  {
    id: 'matrix',
    activeIcon: EisenHowerIcon,
    defaultIcon: EisenHowerHWIcon,
    label: '아이젠하워',
    route: '/matrix',
  },
  {
    id: 'inventory',
    activeIcon: StoreIcon,
    defaultIcon: StoreHWIcon,
    label: '보관함',
    route: '/inventory',
    activePatterns: ['/inventory/'],
  },
];

const bottomNavItems: NavItem[] = [
  {
    id: 'service-info',
    activeIcon: <Info size={24} className="text-blue-500" />,
    defaultIcon: <Info size={24} className="text-gray-400" />,
    label: '서비스 소개',
    route: '/service-info',
    externalLink: 'https://cheerful-perspective-141321.framer.app/',
  },
  {
    id: 'settings',
    activeIcon: <Settings size={24} className="text-blue-500" />,
    defaultIcon: <Settings size={24} className="text-gray-400" />,
    label: '설정',
    route: '/settings',
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const isActive = (item: NavItem): boolean => {
    if (location.pathname === item.route) {
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

  const findActiveItem = (): NavItem => {
    const allItems = [...navItems, ...bottomNavItems];
    return allItems.find((item) => isActive(item)) || navItems[0];
  };

  const activeItem: NavItem = findActiveItem();

  const toggleSidebar = (open: boolean): void => {
    setIsTransitioning(true);
    setIsOpen(open);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item);
    const isIconComponent = typeof item.activeIcon !== 'string';

    return (
      <button
        key={item.id}
        onClick={() => {
          handleItemClick(item);
        }}
        className={cn(
          'flex items-center w-full gap-3 text-left transition-all duration-200 rounded-md cursor-pointer relative p-2 cursor-pointer',
          active
            ? 'bg-[#F0F0F5] text-[#525463]'
            : 'hover:bg-gray-50 text-[#CDCED6]',
          isOpen ? '' : 'px-0 justify-center',
        )}
      >
        <div className="flex items-center justify-center w-6 h-6 min-w-6 relative">
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
        {isOpen && (
          <div className="flex items-center">
            <p
              className={cn(
                'whitespace-nowrap transition-opacity duration-300',
                active ? 'font-medium' : '',
                isTransitioning ? 'opacity-0' : 'opacity-100',
              )}
            >
              {item.label}
            </p>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="h-full">
      <div
        className={cn(
          'bg-white border-r border-[#E5E5E5] h-full flex flex-col transition-all duration-300 ease-in-out rounded-lg',
          isOpen ? 'w-[218px]' : 'w-[70px]',
        )}
      >
        <div className="flex items-center justify-between h-[60px] flex-shrink-0">
          {isOpen ? (
            <>
              <div className="flex items-center gap-3 overflow-hidden pl-6">
                <div className="flex items-center justify-center w-6 h-6 relative">
                  {typeof activeItem.activeIcon === 'string' ? (
                    <img
                      src={activeItem.activeIcon}
                      alt={activeItem.label}
                      className="w-6 h-6 transition-opacity duration-300"
                    />
                  ) : (
                    activeItem.activeIcon
                  )}
                </div>
                <span
                  className={cn(
                    'text-lg font-semibold whitespace-nowrap transition-opacity duration-300',
                    isTransitioning ? 'opacity-0' : 'opacity-100',
                  )}
                >
                  {activeItem.label}
                </span>
              </div>
              <button
                onClick={() => toggleSidebar(false)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 mr-4 transition-all cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={() => toggleSidebar(true)}
              className="flex items-center justify-center w-full h-full transition-all cursor-pointer"
            >
              <div className="w-6 h-6 flex items-center justify-center bg-gray-scale-200 rounded-full">
                <ChevronRight size={40} className="text-blue" />
              </div>
            </button>
          )}
        </div>

        <div className="py-[10px] flex-1 ">
          <div className="flex flex-col gap-[18px] px-4">
            {navItems.map((item) => renderNavItem(item))}
          </div>
        </div>

        <div className="py-[10px] mt-auto flex-shrink-0">
          <div className="flex flex-col gap-[18px] px-4 mb-4">
            {bottomNavItems.map((item) => renderNavItem(item))}
          </div>
        </div>
      </div>
    </div>
  );
}
