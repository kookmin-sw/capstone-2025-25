import { cn } from '@/lib/utils';
import { MindMap } from '@/types/mindMap';
import { Link, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

type MindmapCardProps = {
  mindmap: MindMap;
  isConnected?: boolean;
};

export default function MindmapCard({
  mindmap,
  isConnected = false,
}: MindmapCardProps) {
  const navigate = useNavigate();
  const { id: currentMindMapId } = useParams<{ id: string }>();

  const { title, type, id } = mindmap;

  const selected = currentMindMapId === id;

  const statusColor =
    type === 'THINKING'
      ? 'bg-purple-100 text-primary-100'
      : 'bg-white border border-primary-100 text-primary-100';

  const cardBg = selected ? 'bg-[#ECE5FF] rounded-lg' : 'bg-white';
  const linkedTextColor = selected ? 'text-[#8F5AFF]' : 'text-primary-100';

  const handleClick = () => {
    navigate(`/mindmap/${id}`);
  };

  return (
    <div
      className={cn(
        'relative p-[20px] cursor-pointer transition border-b',
        cardBg,
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'inline-flex items-center gap-1  px-2 py-1 rounded-full font-medium',
            statusColor,
          )}
        >
          <div className="w-[5px] h-[5px] rounded-full bg-primary-100" />
          <p className="text-[12px] truncate">{type}</p>
        </div>
        <X size={16} className="text-gray-700" />
      </div>

      {/* 제목 */}
      <div className="font-heading-4 font-semibold mt-2">{title}</div>

      {isConnected && (
        <div className="flex items-center justify-end gap-1 text-primary-100">
          <Link size={16} />
          <p className="text-[16px]">linked todo</p>
        </div>
      )}

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
