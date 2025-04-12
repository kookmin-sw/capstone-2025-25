import { ReactNode } from 'react';
import { ChevronsLeft } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

type CommonSubSidebarWrapperProps = {
  title: string;
  addButton?: ReactNode;
  children: ReactNode;
};

export default function CommonSubSidebarWrapper({
  title,
  addButton,
  children,
}: CommonSubSidebarWrapperProps) {
  const { setPanelVisible } = useSidebarStore();

  return (
    <div className="relative w-[300px] border-r bg-white h-full overflow-y-auto">
      <div className="p-4 h-[84px] flex items-center justify-between mb-4 border-b border-gray-300">
        <h2 className="font-bold text-lg">{title}</h2>
        <div className="flex items-center gap-1">
          {addButton && <div>{addButton}</div>}
          <button
            onClick={() => setPanelVisible(false)}
            className="cursor-pointer"
          >
            <ChevronsLeft size={20} />
          </button>
        </div>
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}
