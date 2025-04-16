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
import useMatrixStore from '@/store/matrixStore';

type MindmapCardProps = {
  mindmap: MindMap;
  selected: boolean;
};

export default function MindmapCard({ mindmap, selected }: MindmapCardProps) {
  const navigate = useNavigate();
  const deleteMindMap = useDeleteMindMap();
  const setActiveTaskId = useMatrixStore((state) => state.setActiveTaskId);
  const disconnectTaskFromMindMap = useMatrixStore(
    (state) => state.disconnectTaskFromMindMap,
  );

  const { title, type, id, lastModifiedAt, linked, eisenhowerItemDTO } =
    mindmap;

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

    const linkedButton = e.currentTarget.querySelector('.linked-icon');
    if (linkedButton && linkedButton.contains(e.target as Node)) {
      return;
    }

    navigate(`/mindmap/${id}`);
  };

  const handleDelete = () => {
    deleteMindMap(id);
    if (eisenhowerItemDTO) {
      disconnectTaskFromMindMap(eisenhowerItemDTO.id);
    }
    navigate('/mindmap');
  };

  const handleLinkedTaskClick = () => {
    if (eisenhowerItemDTO?.id) {
      setActiveTaskId(eisenhowerItemDTO.id);
      navigate('/matrix');
    }
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
        <TypeBadge type={type} />
        <Modal
          trigger={
            <X
              size={18}
              className="close-button text-gray-700 hidden group-hover:block"
            />
          }
          title="이 마인드맵을 삭제할까요?"
          description="해야 할 일이나 생각이 떠올랐다면 여기 적어보세요!
            질문을 통해 더 깊이 고민할 수 있도록 도와줄게요"
          footer={
            <Button size="sm" onClick={handleDelete}>
              삭제하기
            </Button>
          }
        >
          <div className="border-[1px] border-[#E5E5E5] p-[20px] rounded-[7px] flex flex-col gap-[10px]">
            <TypeBadge type={type} />

            <div className="font-heading-4 font-semibold text-[18px] h-[18px]">
              {title}
            </div>

            <p className="text-[14px] text-[#6E726E]">
              최종 수정: {formatDate(lastModifiedAt)}
            </p>
          </div>
        </Modal>
      </div>

      <div className="font-heading-4 font-semibold text-[16px] pl-1">
        {title}
      </div>

      {linked && (
        <div className="flex justify-end w-full">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleLinkedTaskClick();
            }}
            className="linked-icon items-center gap-1 text-[#9F4BC9] inline-flex"
          >
            <Link size={14} />
            <p>{eisenhowerItemDTO?.title}</p>
          </div>
        </div>
      )}

      <p className="text-[14px] text-[#6E726E]">
        최종 수정: {formatDate(lastModifiedAt)}
      </p>
    </div>
  );
}
