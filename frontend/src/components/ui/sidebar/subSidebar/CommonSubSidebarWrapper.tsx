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
    <div className="relative w-[300px] border-r  h-full overflow-y-auto scrollbar-hide ">
      <div className="p-[15px] h-[55px] flex items-center justify-between border-b border-[#E5E5E5] bg-[#ffffff] z-10 sticky top-0">
        <h2 className="font-semibold text-lg">{title}</h2>
        <div className="flex items-center gap-[5px]">
          {addButton && <div>{addButton}</div>}
          <button
            onClick={() => setPanelVisible(false)}
            className="cursor-pointer"
          >
            <ChevronsLeft size={22} />
          </button>
        </div>
      </div>
      <div className="bg-[linear-gradient(to_bottom,_white,_transparent)] fixed top-[55px] w-[300px] h-[15px] z-10"></div>


      <div className="px-[15px] py-[20px]" >{children}</div>
    </div>
  );
}
