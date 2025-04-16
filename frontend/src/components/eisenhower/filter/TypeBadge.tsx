import { Badge } from '@/components/ui/Badge.tsx';
import { cn } from '@/lib/utils';
import { TaskType } from '@/types/commonTypes';

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
  const styleMap = {
    ALL: {
      colorClass: 'border border-gray-300 text-gray-500 bg-white',
      dotColor: 'bg-gray-400',
      label: '모든 타입',
    },
    TODO: {
      colorClass: 'border border-[#8D5CF6] text-[#8D5CF6] bg-white',
      dotColor: 'bg-[#8D5CF6]',
      label: 'Todo',
    },
    THINKING: {
      colorClass: 'bg-[#E9DDFF] text-[#8D5CF6]',
      dotColor: 'bg-[#8D5CF6]',
      label: 'Thinking',
    },
  };

  const { colorClass, dotColor, label } = styleMap[type];

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center text-sm font-semibold px-3 py-1 rounded-full gap-[5px]',
        colorClass,
        className,
      )}
    >
      {withDot && <span className={`w-2 h-2 rounded-full ${dotColor}`} />}
      {label}
    </Badge>
  );
};
