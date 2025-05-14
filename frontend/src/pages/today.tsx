import ReminderList from '@/components/today/ReminderList';
import TodayMainDashborad from '@/components/today/TodayMainDashborad';

const QUOTES = [
  '조금씩, 하지만 꾸준히! 오늘도 파이팅 ✨',
  '작은 발걸음이 큰 변화를 만든다 🚶‍♂️',
  '어제보다 한 뼘 더 성장한 나를 믿어요 🌱',
  '포기하지 않는 한 실패는 없다 💪',
  '천천히 가도 괜찮아, 멈추지 않는다면 🐢',
  '오늘의 나는 어제의 나보다 멋져요 😎',
  '꾸준함은 결국 기적을 만든다 ✨',
  '쉬어가도 괜찮아, 다시 시작하면 돼 🌈',
  '할 수 있다는 믿음이 힘이 된다 🙌',
  '지금 이 순간도 충분히 가치 있어요 💖',
];

export default function TodayListPage() {
  const randomIndex = Math.floor(Math.random() * QUOTES.length);
  const randomQuote = QUOTES[randomIndex];
  return (
    <div className="w-full">
      <h1 className="block lg:hidden text-[20px] text-[28px] text-[#525463] font-semibold mb-6">
        오늘의 할 일
      </h1>

      <div className="w-full bg-white p-4 md:p-6 rounded-2xl text-[16px] md:text-[20px] text-[#525463] font-semibold mb-6 md:mb-10">
        {randomQuote}
      </div>

      <ReminderList />
      <TodayMainDashborad />
    </div>
  );
}
