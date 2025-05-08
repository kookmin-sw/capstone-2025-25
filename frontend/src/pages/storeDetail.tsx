import { useState } from 'react';
import { Folder, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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
      <div className="flex items-center gap-2 mb-4">
        <Folder size={48} />
        <h1 className="text-2xl text-gray-700 font-semibold">운동</h1>
      </div>

      <ul className="flex flex-col gap-4">
        {STORE_DETAIL_LIST.map((store) => (
          <li key={store.id} className="bg-gray-100 p-4 rounded-lg">
            <Collapsible
              open={openItems[store.id]}
              onOpenChange={() => toggleItem(store.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl text-gray-700 font-semibold">
                    {store.title}
                  </h3>
                  <p className="text-sm text-gray-400">{store.date}</p>
                </div>

                <CollapsibleTrigger asChild>
                  <button className="px-4 py-2 bg-blue-2 text-blue rounded-full font-semibold flex items-center gap-1">
                    {openItems[store.id] ? '접기' : '메모보기'}
                  </button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent>
                <p className="bg-gray-200 p-6 rounded-lg">
                  메모를 입력해주세요메모를 입력해주세요메모를
                  입력해주세요메모를 입력해주세요메모를 입력해주세요메모를
                  입력해주세요메모를 입력해주세요메모를 입력해주세요메모를
                  입력해주세요dsadasdasdasdasdasdasdasdasdasdsad
                </p>

                <div className="flex items-center justify-end gap-2 mt-4">
                  <p className="text-gray-400 cursor-pointer hover:text-gray-600">
                    수정하기
                  </p>
                  <Trash2
                    className="text-gray-300 cursor-pointer hover:text-red-500"
                    size={18}
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
