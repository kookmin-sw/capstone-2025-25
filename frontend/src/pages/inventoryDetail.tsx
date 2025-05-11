import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import FolderIcon from '@/assets/folder.png';

const STORE_DETAIL_LIST = [
  { id: 0, title: '운동을 잘하는 법', date: '2025.05.08 (화)' },
  { id: 1, title: '운동을 잘하는 법', date: '2025.05.08 (화)' },
  { id: 2, title: '운동을 잘하는 법', date: '2025.05.08 (화)' },
  { id: 3, title: '운동을 잘하는 법', date: '2025.05.08 (화)' },
  { id: 4, title: '운동을 잘하는 법', date: '2025.05.08 (화)' },
  { id: 5, title: '운동을 잘하는 법', date: '2025.05.08 (화)' },
];

export default function StoreDetail() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="p-10">
      <div className="flex items-center gap-2 mb-8">
        <img src={FolderIcon} className="w-[37.5px] h-[30px]" />
        <h1 className="text-2xl text-gray-700 font-semibold">운동</h1>
      </div>

      <ul className="flex flex-col gap-4">
        {STORE_DETAIL_LIST.map((store) => (
          <li key={store.id} className="p-6 bg-white rounded-xl">
            <Collapsible
              open={openItems[store.id]}
              onOpenChange={() => toggleItem(store.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl text-gray-700 font-semibold pb-2">
                    {store.title}
                  </h3>
                  <p className="text-sm text-gray-400">{store.date}</p>
                </div>

                <CollapsibleTrigger asChild>
                  <button className="px-4 py-2 bg-blue-2 text-blue rounded-full font-semibold flex items-center gap-1 cursor-pointer">
                    {/* 메모가 없으면 메모 입력으로 처리할 예정 */}
                    {openItems[store.id] ? '접기' : '메모보기'}
                  </button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent>
                <textarea className="w-full bg-gray-scale-200 p-6 rounded-lg resize-none mt-6">
                  메모를 입력해주세요메모를 입력해주세요메모를
                  입력해주세요메모를 입력해주세요메모를 입력해주세요메모를
                  입력해주세요메모를 입력해주세요메모를 입력해주세요메모를
                  입력해주세요dsadasdasdasdasdasdasdasdasdasdsad
                </textarea>

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
        ))}
      </ul>
    </div>
  );
}
