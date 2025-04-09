// components/ui/CategoryBadge.tsx

import { X } from 'lucide-react';

interface CategoryBadgeProps {
  label: string;
  colorClass: string;
  className?: string;
  showDelete?: boolean;
  onDelete?: () => void;
}

export const CategoryBadge = ({
  label,
  colorClass,
  className = '',
  showDelete = false,
  onDelete,
}: CategoryBadgeProps) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {label}
      </span>
      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 드롭다운 닫힘 방지
            onDelete();
          }}
          className="ml-1 text-red-500 hover:bg-red-100 rounded-full p-0.5"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
