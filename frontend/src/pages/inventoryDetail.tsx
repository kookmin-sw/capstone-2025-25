import FolderIcon from '@/assets/folder.png';
import useGetInventoryItemList from '@/hooks/queries/inventory/item/useGetInventoryItemList';
import { useParams } from 'react-router';
import { parseIdParam } from '@/lib/parseIdParam';
import InventoryItemCard from '@/components/inventory/InventoryItemCard';

export default function StoreDetail() {
  const { id } = useParams<{ id: string }>();
  const numericId = parseIdParam(id);

  const { inventoryItemList, isLoading } = useGetInventoryItemList(numericId);

  if (isLoading) {
    return <div className="p-10">로딩 중...</div>;
  }

  return (
    <div className="p-10">
      <div className="flex items-center gap-2 mb-8">
        <img src={FolderIcon} className="w-[37.5px] h-[30px]" alt="폴더" />
        <h1 className="text-2xl text-gray-700 font-semibold">운동</h1>
      </div>

      <ul className="flex flex-col gap-4">
        {inventoryItemList && inventoryItemList.length > 0 ? (
          inventoryItemList.map((item) => (
            <InventoryItemCard key={item.id} item={item} />
          ))
        ) : (
          <div className="text-center p-6 bg-white rounded-xl text-gray-500">
            항목이 없습니다.
          </div>
        )}
      </ul>
    </div>
  );
}
