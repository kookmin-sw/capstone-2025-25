import { Badge } from '@/components/ui/badge.tsx';
import { X } from 'lucide-react';

interface CategoryBadgeProps {
  label: string;
  colorClass?: string;
  showDelete?: boolean;
  onDelete?: () => void;
}

export function CategoryBadge({
  label,
  colorClass = 'bg-yellow-100 text-yellow-600',
  showDelete,
  onDelete,
}: CategoryBadgeProps) {
  return (
    <div className="flex items-center">
      <Badge className={colorClass}>{label}</Badge>
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
