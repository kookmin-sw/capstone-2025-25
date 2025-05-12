import { Badge } from '@/components/ui/Badge.tsx';
import { X } from 'lucide-react';

interface CategoryBadgeProps {
  label: string;
  bgColor?: string;
  textColor?: string;
  showDelete?: boolean;
  onDelete?: () => void;
}

export function CategoryBadge({
  label,
  bgColor = '#E5E7EB',
  textColor = '#15161A',
  showDelete,
  onDelete,
}: CategoryBadgeProps) {
  return (
    <div className="flex items-center">
      <Badge
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
        className="rounded-full px-3 py-1 font-md text-sm "
      >
        {label}
      </Badge>
      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="ml-1 text-gray-400 hover:text-red-500"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
