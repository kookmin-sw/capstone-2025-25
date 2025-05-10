import { useNavigate } from 'react-router';
import FolderIcon from '@/assets/folder.png';
import { ChevronRight, Plus } from 'lucide-react';

const STORE_LIST = [
  { id: 0, title: '운동', count: 10 },
  { id: 1, title: '회의', count: 3 },
  { id: 2, title: '캡스톤', count: 6 },
  { id: 3, title: '공부', count: 1 },
  { id: 4, title: '축구', count: 4 },
  { id: 5, title: '런닝', count: 7 },
];

export default function store() {
  const navigate = useNavigate();

  const handleRouteToStoreDetail = (id) => {
    navigate(`/store/${id}`);
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-4 mb-8">
          <h1 className="text-[28px] text-[#525463] font-semibold">
            나의 보관함
          </h1>
          <p className="text-[#525463]">나의 생각을 보관해보세요</p>
        </div>
        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center">
          <Plus size={18} />
        </div>
      </div>

      <ul className="bg-gray-scale-200 rounded-lg flex flex-col gap-4">
        {STORE_LIST.map((store) => (
          <li
            className="flex items-center justify-between px-8 py-4 bg-white rounded-xl cursor-pointer"
            onClick={() => handleRouteToStoreDetail(store.id)}
          >
            <div className="flex items-center gap-4">
              <img src={FolderIcon} className="w-[37.5px] h-[30px]" />
              <p className="text-[20px] text-[#15161A] font-semibold">
                {store.title}
              </p>
              <p className="text-[#A9ABB8] font-semibold">{store.count}</p>
            </div>
            <ChevronRight className="text-[#A9ABB8]" />
          </li>
        ))}
      </ul>
    </div>
  );
}
