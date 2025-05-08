import { Folder } from 'lucide-react';
import { useNavigate } from 'react-router';

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
      <div className="flex items-end gap-4 mb-8">
        <h1 className="text-[28px] text-[#525463] font-semibold">
          나의 보관함
        </h1>
        <p className="text-[#525463]">나의 생각을 보관해보세요</p>
      </div>

      <ul className="bg-gray-scale-200 p-4 rounded-lg flex flex-col">
        {STORE_LIST.map((store) => (
          <li
            className="flex items-center justify-between"
            onClick={() => handleRouteToStoreDetail(store.id)}
          >
            <div className="flex items-center gap-2">
              <Folder />
              <p>{store.title}</p>
            </div>
            <p>{store.count}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
