import { ReactNode } from 'react';
import { ChevronsLeft } from 'lucide-react';

type CommonPanelWrapperProps = {
  title: string;
  onClose: () => void;
  addButton: ReactNode;
  children: ReactNode;
};

export default function CommonPanelWrapper({
  title,
  onClose,
  addButton,
  children,
}: CommonPanelWrapperProps) {
  return (
    <div className="relative w-[300px] border-r bg-white h-full overflow-y-auto">
      <div className="px-[20px] py-[10px] h-[83px] flex items-center justify-between mb-4 border-b border-gray-300">
        <h2 className="font-bold text-lg">{title}</h2>
        <div className="flex items-center gap-1">
          {addButton && <div>{addButton}</div>}
          <button onClick={onClose} className="cursor-pointer">
            <ChevronsLeft size={20} />
          </button>
        </div>
      </div>

      <div className="px-[20px] py-[10px]">{children}</div>
    </div>
  );
}
