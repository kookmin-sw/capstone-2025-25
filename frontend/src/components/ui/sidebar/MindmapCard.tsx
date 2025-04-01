import { cn } from '@/lib/utils';
import { Link2 } from 'lucide-react';

type MindmapCardProps = {
  status?: 'Todo' | 'Thinking';
  title?: string;
  date?: string;
  linked?: boolean;
  members?: { label: string; color: string }[];
  bg?: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function MindmapCard({
  status = 'Todo',
  title = 'title',
  date = 'date',
  linked = true,
  bg = 'bg-white',
  selected = false,
  onClick,
}: MindmapCardProps) {
  const statusColor =
    status === 'Thinking'
      ? 'bg-purple-100 text-purple-600'
      : 'bg-white border border-purple-500 text-purple-600';

  const cardBg = selected ? 'bg-[#ECE5FF]' : bg;
  const linkedTextColor = selected ? 'text-[#8F5AFF]' : 'text-purple-600';

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg cursor-pointer transition',
        cardBg,
      )}
      onClick={onClick}
    >
      {/* 상태 뱃지 */}
      <span
        className={cn(
          'text-xs px-2 py-1 rounded-full font-medium',
          statusColor,
        )}
      >
        ● {status}
      </span>

      {/* 제목 */}
      <div className="font-semibold mt-2">{title}</div>

      {/* 수정일 + 링크 */}
      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
        최종 수정: {date}
        {linked && (
          <span
            className={cn('flex items-center gap-1 text-sm', linkedTextColor)}
          >
            <Link2 size={14} /> linked todo
          </span>
        )}
      </div>
    </div>
  );
}
