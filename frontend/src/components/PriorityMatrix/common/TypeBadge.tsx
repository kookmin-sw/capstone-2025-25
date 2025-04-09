// components/ui/TypeBadge.tsx

type TaskType = 'Todo' | 'Thinking' | 'all';

interface TypeBadgeProps {
  type: TaskType;
  withDot?: boolean;
  className?: string;
}

export const TypeBadge = ({
  type,
  withDot = true,
  className = '',
}: TypeBadgeProps) => {
  const isAll = type === 'all';

  const colorClass = isAll
    ? 'border-gray-300 text-gray-500'
    : 'border-[#8D5CF6] text-[#8D5CF6]';

  const dotColor = isAll ? 'bg-gray-400' : 'bg-[#8D5CF6]';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${colorClass} ${className}`}
    >
      {withDot && <span className={`w-2 h-2 rounded-full mr-2 ${dotColor}`} />}
      {type === 'all' ? '모든 타입' : type}
    </span>
  );
};
