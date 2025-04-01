import { cn } from '@/lib/utils';
import { MindMap } from '@/types/mindMap';
import { Link2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

type MindmapCardProps = {
  mindmap: MindMap;
};

export default function MindmapCard({ mindmap }: MindmapCardProps) {
  const navigate = useNavigate();
  const { id: currentMindMapId } = useParams<{ id: string }>();

  const { title, type, id } = mindmap;

  const selected = currentMindMapId === id;

  const statusColor =
    type === 'THINKING'
      ? 'bg-purple-100 text-purple-600'
      : 'bg-white border border-purple-500 text-purple-600';

  const cardBg = selected ? 'bg-[#ECE5FF]' : 'bg-white';
  const linkedTextColor = selected ? 'text-[#8F5AFF]' : 'text-purple-600';

  const handleClick = () => {
    navigate(`/mindmap/${id}`);
  };

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg cursor-pointer transition',
        cardBg,
      )}
      onClick={handleClick}
    >
      <span
        className={cn(
          'text-xs px-2 py-1 rounded-full font-medium',
          statusColor,
        )}
      >
        ● {type}
      </span>

      {/* 제목 */}
      <div className="font-semibold mt-2">{title}</div>

      {/* 수정일 + 링크 */}
      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
        최종 수정: date
        {/* {linked && (
          <span
            className={cn('flex items-center gap-1 text-sm', linkedTextColor)}
          >
            <Link2 size={14} /> linked todo
          </span>
        )} */}
      </div>
    </div>
  );
}
