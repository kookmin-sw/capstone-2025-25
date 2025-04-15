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
  textColor = '#FFFFFF',
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
        className="rounded-full px-3 py-1 text-xs font-semibold"
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
