import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import FolderIcon from '@/assets/folder.png';
import useGetInventoryItemList from '@/hooks/queries/inventory/item/useGetInventoryItemList';
import { useParams } from 'react-router';
import { parseIdParam } from '@/lib/parseIdParam';
import { Input } from '@/components/ui/Input';

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

export default function StoreDetail() {
  const [memos, setMemos] = useState<Record<number, string>>({});
  const [titles, setTitles] = useState<Record<number, string>>({});
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const { id } = useParams<{ id: string }>();
  const numericId = parseIdParam(id);

  const { inventoryItemList } = useGetInventoryItemList(numericId);

  const toggleItem = (id: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleMemoChange = (id: number, value: string) => {
    setMemos((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleTitleChange = (id: number, value: string) => {
    setTitles((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="p-10">
      <div className="flex items-center gap-2 mb-8">
        <img src={FolderIcon} className="w-[37.5px] h-[30px]" alt="폴더" />
        <h1 className="text-2xl text-gray-700 font-semibold">운동</h1>
      </div>

      <ul className="flex flex-col gap-4">
        {inventoryItemList &&
          inventoryItemList.map((store) => {
            const memoValue =
              memos[store.id] !== undefined
                ? memos[store.id]
                : store.memo || '메모를 입력해주세요';

            const titleValue =
              titles[store.id] !== undefined ? titles[store.id] : store.title;

            const buttonText = openItems[store.id]
              ? '접기'
              : store.memo
                ? '메모보기'
                : '메모입력';

            return (
              <li key={store.id} className="p-6 bg-white rounded-xl">
                <Collapsible
                  open={openItems[store.id]}
                  onOpenChange={() => toggleItem(store.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-2/3">
                      {openItems[store.id] ? (
                        <div className="pb-2">
                          <Input
                            value={titleValue}
                            onChange={(e) =>
                              handleTitleChange(store.id, e.target.value)
                            }
                            placeholder="제목을 입력하세요"
                            className="!text-[20px] text-gray-700 font-semibold px-0 py-0 h-auto border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                          />
                        </div>
                      ) : (
                        <h3 className="text-[20px] text-gray-700 font-semibold pb-2">
                          {titleValue}
                        </h3>
                      )}
                      <p className="text-sm text-gray-400">
                        {formatDate(store.createdAt)}
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
                      value={memoValue}
                      onChange={(e) =>
                        handleMemoChange(store.id, e.target.value)
                      }
                      placeholder="메모를 입력해주세요"
                    />

                    <div className="flex items-center justify-end gap-4 mt-4">
                      <p className="text-blue cursor-pointer hover:text-blue-2">
                        저장하기
                      </p>
                      <Trash2
                        className="cursor-pointer"
                        size={21}
                        color="#CDCED6"
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
