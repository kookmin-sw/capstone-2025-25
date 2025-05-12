import useGetRecentInventory from '@/hooks/queries/inventory/item/useGetRecentInventory';
import { useNavigate } from 'react-router';

export default function ReminderList() {
  const { inventoryRecentList } = useGetRecentInventory();
  const navigate = useNavigate();

  const handleClickReminder = (folderId: number, itemId: number) => {
    navigate(`/inventory/${folderId}?itemId=${itemId}`);
  };

  return (
    <div className="w-full mt-6 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-[20px] text-[#525463] font-semibold">리마인더</h4>
        <p className="text-blue text-[14px] cursor-pointer">더보기 {'>'} </p>
      </div>

      <div className="w-full overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {inventoryRecentList &&
            inventoryRecentList.map((remind) => (
              <div
                key={remind.id}
                className="bg-white rounded-lg px-6 py-4 cursor-pointer flex-none"
                style={{ width: '16rem' }}
                onClick={() => handleClickReminder(remind.folderId, remind.id)}
              >
                <h3 className="text-[20px] text-[#525463] font-semibold">
                  {remind.title}
                </h3>
                <p className="text-gray-500">{remind.memo}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
