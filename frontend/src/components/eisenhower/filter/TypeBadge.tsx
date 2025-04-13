import { Badge } from '@/components/ui/badge.tsx';
import type { TaskType } from '@/types/task.ts';
import { cn } from '@/lib/utils';

type TypeBadgeProps = {
  type: TaskType;
  withDot?: boolean;
  className?: string;
};

export const TypeBadge = ({
  type,
  withDot = true,
  className,
}: TypeBadgeProps) => {
  const isAll = type === 'ALL';

  const colorClass = isAll
    ? 'border border-gray-300 text-gray-500 bg-white'
    : 'border border-[#E9DDFF] text-[#8D5CF6] bg-[#F5F0FF]';

  const dotColor = isAll ? 'bg-gray-400' : 'bg-[#8D5CF6]';

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full',
        colorClass,
        className,
      )}
    >
      {withDot && <span className={`w-2 h-2 rounded-full mr-1 ${dotColor}`} />}
      {type === 'ALL' ? '모든 타입' : type}
    </Badge>
  );
};
