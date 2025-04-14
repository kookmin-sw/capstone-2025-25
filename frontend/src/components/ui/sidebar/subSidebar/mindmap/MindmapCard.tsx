import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { useDeleteMindMap } from '@/store/mindmapListStore';
import { MindMap } from '@/types/mindMap';
import { Link, X } from 'lucide-react';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge';

import { useNavigate } from 'react-router';
import { MouseEvent } from 'react';

type MindmapCardProps = {
  mindmap: MindMap;
  selected: boolean;
};

export default function MindmapCard({ mindmap, selected }: MindmapCardProps) {
  const navigate = useNavigate();
  const deleteMindMap = useDeleteMindMap();

  const { title, type, id, lastModifiedAt, linked } = mindmap;

  const statusColor =
    type === 'THINKING'
      ? 'bg-purple-100 text-primary-100'
      : 'bg-white border border-primary-100 text-primary-100';

  const cardBg = selected ? 'bg-[#ECE5FF] rounded-lg' : 'bg-white';

  const handleClick = (e: MouseEvent) => {
    const closeButton = e.currentTarget.querySelector('.close-button');
    if (closeButton && closeButton.contains(e.target as Node)) {
      return;
    }

    const target = e.target as HTMLElement;
    if (
      target.getAttribute('data-slot') === 'dialog-overlay' ||
      target.closest('[data-slot="dialog-overlay"]')
    ) {
      return;
    }

    navigate(`/mindmap/${id}`);
  };

  const handleDelete = () => {
    deleteMindMap(id);
    navigate('/mindmap');
  };

  return (
    <div
      className={cn(
        'p-[20px] cursor-pointer transition border-b flex flex-col gap-[5px] relative group',
        cardBg,
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <TypeBadge type={type}/>
        <Modal
          trigger={<X size={16} className="close-button text-gray-700 hidden group-hover:block" />}
          title="이 마인드맵을 삭제할까요?"
          description="해야 할 일이나 생각이 떠올랐다면 여기 적어보세요! 
            질문을 통해 더 깊이 고민할 수 있도록 도와줄게요"
          footer={<Button onClick={handleDelete}>삭제하기</Button>}
        >
          <div className="border border-border-gray p-[20px] rounded-sm flex flex-col gap-[10px]">
            <div
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium w-fit',
                statusColor,
              )}
            >
              <div className="w-[5px] h-[5px] rounded-full bg-primary-100" />
              <p className="text-[12px] truncate">{type}</p>
            </div>

            <div className="font-heading-4 font-bold text-[18px]">{title}</div>

            <p className="text-[14px] text-gray-700">
              최종 수정: {formatDate(lastModifiedAt)}
            </p>
          </div>
        </Modal>
      </div>

      <div className="font-heading-4 font-semibold text-[16px] pl-1">{title}</div>

      {linked && (
        <div className="flex items-center justify-end gap-1 text-[#9F4BC9]">
          <Link size={14} />
          <p>linked todo</p>
        </div>
      )}

      <p className="text-[14px] text-[#6E726E]">
        최종 수정: {formatDate(lastModifiedAt)}
      </p>
    </div>
  );
}
