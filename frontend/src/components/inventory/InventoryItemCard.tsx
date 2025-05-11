import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/Input';
import useUpdateInventoryItem from '@/hooks/queries/inventory/item/useUpdateInventoryItem';
import { UpdateInventoryItemReq } from '@/types/api/inventory/item';

type InventoryItemCardProps = {
  item: {
    id: number;
    title: string;
    memo: string;
    createdAt: string;
  };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '날짜 정보 없음';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDay = weekDays[date.getDay()];

  return `${year}.${month}.${day} (${weekDay})`;
};

export default function IntentoryItemCard({ item }: InventoryItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [memo, setMemo] = useState(item.memo || '');

  const { updateInventoryItemMutation, isPending } = useUpdateInventoryItem(
    item.id,
  );

  const handleSave = () => {
    const updateData: UpdateInventoryItemReq = {
      title,
      memo,
    };

    updateInventoryItemMutation(
      { data: updateData },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      },
    );
  };

  const buttonText = isOpen ? '접기' : item.memo ? '메모보기' : '메모입력';

  return (
    <li className="p-6 bg-white rounded-xl">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="w-2/3">
            {isOpen ? (
              <div className="pb-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="!text-[20px] text-gray-700 font-semibold px-0 py-0 h-auto border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                />
              </div>
            ) : (
              <h3 className="text-[20px] text-gray-700 font-semibold pb-2">
                {title}
              </h3>
            )}
            <p className="text-sm text-gray-400">
              {formatDate(item.createdAt)}
            </p>
          </div>

          <CollapsibleTrigger asChild>
            <button className="px-4 py-2 bg-blue-2 text-blue rounded-full font-semibold flex items-center gap-1 cursor-pointer">
              {buttonText}
            </button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <textarea
            className="w-full bg-gray-scale-200 p-6 rounded-lg resize-none mt-6"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력해주세요"
          />

          <div className="flex items-center justify-end gap-4 mt-4">
            <button
              onClick={handleSave}
              className="text-blue cursor-pointer hover:text-blue-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? '저장 중...' : '저장하기'}
            </button>
            <Trash2 className="cursor-pointer" size={21} color="#CDCED6" />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}
