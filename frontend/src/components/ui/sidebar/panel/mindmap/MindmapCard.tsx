import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { MindMap } from '@/types/mindMap';
import { Link, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

type MindmapCardProps = {
  mindmap: MindMap;
};

export default function MindmapCard({ mindmap }: MindmapCardProps) {
  const navigate = useNavigate();
  const { id: currentMindMapId } = useParams<{ id: string }>();

  const { title, type, id, lastModifiedAt, linked } = mindmap;

  const selected = currentMindMapId === id;

  const statusColor =
    type === 'THINKING'
      ? 'bg-purple-100 text-primary-100'
      : 'bg-white border border-primary-100 text-primary-100';

  const cardBg = selected ? 'bg-[#ECE5FF] rounded-lg' : 'bg-white';

  const handleClick = () => {
    navigate(`/mindmap/${id}`);
  };

  return (
    <div
      className={cn(
        'p-[20px] cursor-pointer transition border-b flex flex-col gap-[10px]',
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

      <div className="font-heading-4 font-bold text-[18px]">{title}</div>

      {linked && (
        <div className="flex items-center justify-end gap-1 text-primary-100">
          <Link size={14} />
          <p>linked todo</p>
        </div>
      )}

      <p className="text-[14px] text-gray-700">
        최종 수정: {formatDate(lastModifiedAt)}
      </p>
    </div>
  );
}
