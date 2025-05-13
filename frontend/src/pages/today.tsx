import ReminderList from '@/components/today/ReminderList';
import TodayMainDashborad from '@/components/today/TodayMainDashborad';

export default function TodayListPage() {
  return (
    <div className="w-full">
      <h1 className="block lg:hidden text-[28px] text-[#525463] font-semibold mb-6">
        오늘의 할 일
      </h1>

      <div className="w-full bg-white p-4 md:p-6 rounded-lg text-[20px] text-[#525463] font-semibold mb-10">
        조금씩, 하지만 꾸준히! 오늘도 파이팅 ✨
      </div>

      <ReminderList />
      <TodayMainDashborad />
    </div>
  );
}
