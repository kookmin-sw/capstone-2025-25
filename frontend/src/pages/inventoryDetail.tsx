import { useEffect, useRef } from 'react';
import FolderIcon from '@/assets/folder.png';
import useGetInventoryItemList from '@/hooks/queries/inventory/item/useGetInventoryItemList';
import { useParams, useSearchParams } from 'react-router';
import { parseIdParam } from '@/lib/parseIdParam';
import InventoryItemCard from '@/components/inventory/InventoryItemCard';
import useGetInventoryFolderDetail from '@/hooks/queries/inventory/folder/useGetInventoryFolderDetail';
import ArrowLeft from '@/assets/arrow_left.svg';
import { useNavigate } from 'react-router';

type ItemRefs = {
  [key: number]: HTMLDivElement | null;
};

export default function StoreDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const itemIdParam = searchParams.get('itemId');
  const highlightedItemId = itemIdParam ? parseInt(itemIdParam) : null;

  const numericId = parseIdParam(id);

  const itemRefs = useRef<ItemRefs>({});

  const { inventoryFolderDetail } = useGetInventoryFolderDetail(numericId);
  const { inventoryItemList } = useGetInventoryItemList(numericId);

  useEffect(() => {
    if (highlightedItemId !== null && itemRefs.current[highlightedItemId]) {
      setTimeout(() => {
        const element = itemRefs.current[highlightedItemId];
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100);
    }
  }, [inventoryItemList, highlightedItemId]);

  const setItemRef = (id: number) => (el: HTMLDivElement | null) => {
    itemRefs.current[id] = el;
  };

  const moveToInventory = () => {
    navigate('/inventory');
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <img
          src={ArrowLeft}
          onClick={moveToInventory}
          className="cursor-pointer "
        />
        <img src={FolderIcon} className="w-[37.5px] h-[30px]" alt="폴더" />
        {inventoryFolderDetail && (
          <h1 className="text-[28px] text-gray-700 font-semibold">
            {inventoryFolderDetail.name}
          </h1>
        )}
      </div>

      <ul className="flex flex-col gap-4">
        {inventoryItemList && inventoryItemList.length > 0 ? (
          inventoryItemList.map((item) => (
            <div key={item.id} ref={setItemRef(item.id)}>
              <InventoryItemCard
                item={item}
                initiallyOpen={
                  highlightedItemId !== null && item.id === highlightedItemId
                }
              />
            </div>
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
