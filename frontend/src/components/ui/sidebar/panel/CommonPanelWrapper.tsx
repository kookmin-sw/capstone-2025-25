import { ReactNode } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';

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
    <div className="relative w-[300px] border-r p-4 bg-white h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">{title}</h2>
        <div className="flex items-center">
          {addButton && <div className="mr-2">{addButton}</div>}
          <button
            onClick={onClose}
            className="top-4 z-10 w-8 h-8 flex items-center justify-center"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
