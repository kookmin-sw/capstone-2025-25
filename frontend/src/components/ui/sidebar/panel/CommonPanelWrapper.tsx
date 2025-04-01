import { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function CommonPanelWrapper({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative w-[300px] border-r p-4 bg-white h-full overflow-y-auto">
      <div className="flex justify-between">
        <h2 className="font-bold text-lg mb-4">{title}</h2>
        <button
          onClick={onClose}
          className="top-4 z-10 w-8 h-8 flex items-center justify-center"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
      {children}
    </div>
  );
}
