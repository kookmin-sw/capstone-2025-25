import useGetRecentInventory from '@/hooks/queries/inventory/item/useGetRecentInventory';
import { useNavigate } from 'react-router';

export default function ReminderList() {
  const { inventoryRecentList } = useGetRecentInventory();
  const navigate = useNavigate();

  if (!inventoryRecentList || inventoryRecentList.length === 0) {
    return null;
  }

  const handleRouteToInventory = () => {
    navigate('/inventory');
  };

  const handleClickReminder = (folderId: number, itemId: number) => {
    navigate(`/inventory/${folderId}?itemId=${itemId}`);
  };

  return (
    <div className="w-full mb-6 flex flex-col gap-2 md:gap-[17px] ">
      <div className="flex items-center gap-4 mb-2 ml-2  md:ml-2">
        <h4 className="text-[20px] text-[#525463] font-semibold">리마인더</h4>
        <p
          className="text-blue text-[14px] cursor-pointer"
          onClick={handleRouteToInventory}
        >
          더보기 {'>'}{' '}
        </p>
      </div>

      <div className="w-full h-fit overflow-x-auto ">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {inventoryRecentList &&
            inventoryRecentList.map((remind) => (
              <div
                key={remind.id}
                className="flex flex-col gap-4 h-fit bg-white rounded-2xl px-6 py-4 cursor-pointer flex-none"
                style={{ width: '16rem' }}
                onClick={() => handleClickReminder(remind.folderId, remind.id)}
              >
                <h3 className="text-[16px] md:text-[20px] text-[#525463] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                  {remind.title}
                </h3>
                <p className="text-[14px] md:text-[16px] text-gray-scale-500 whitespace-nowrap overflow-hidden text-ellipsis">
                  {remind.memo || '입력된 메모가 없습니다'}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
