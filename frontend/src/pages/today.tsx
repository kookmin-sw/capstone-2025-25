import TodayList from '@/components/today/TodayList';
import { DailyCompletionChart } from '@/components/ui/chart/DailyCompletionChart';
import { TodayCompleteChart } from '@/components/ui/chart/TodayCompleteChart';
import { Plus } from 'lucide-react';

// 리마인더 데이터
const REMIND_DATA = [
  {
    id: 0,
    title: '도훈 버블팝 춤 연습하기',
    content: '버블팝 연습해서 양정민 앞에...',
    category: 'category1',
    dueDate: '2022-01-20',
    reminder: true,
    completed: false,
  },
  {
    id: 1,
    title: '도훈 버블팝 춤 연습하기',
    content: '버블팝 연습해서 양정민 앞에...',
    category: 'category1',
    dueDate: '2022-01-20',
    reminder: false,
    completed: false,
  },
  {
    id: 2,
    title: '도훈 버블팝 춤 연습하기',
    content: '버블팝 연습해서 양정민 앞에...',
    category: 'category1',
    dueDate: '2022-01-20',
    reminder: false,
    completed: true,
  },
  {
    id: 3,
    title: '도훈 버블팝 춤 연습하기',
    content: '버블팝 연습해서 양정민 앞에...',
    category: 'category1',
    dueDate: '2022-01-20',
    reminder: false,
    completed: false,
  },
];

export default function TodayListPage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  return (
    <div className="px-6">
      <h1 className="block lg:hidden text-[28px] text-[#525463] font-semibold mb-6">
        오늘의 할 일
      </h1>

      <div className="w-full bg-white px-6 py-4 rounded-xl text-[20px] text-[#525463] font-semibold">
        조금씩, 하지만 꾸준히! 오늘도 파이팅 ✨
      </div>

      {/* 리마인더 섹션 */}
      <div className="mt-6 mb-4">
        <div className="flex items-center gap-4 mb-2">
          <h4 className="text-[20px] text-[#525463] font-semibold">리마인더</h4>
          <p className="text-blue text-[14px]">더보기 {'>'} </p>
        </div>

        <ul className="flex gap-4 overflow-x-auto pb-2">
          {REMIND_DATA.map((remind) => (
            <li
              key={remind.id}
              className="bg-white rounded-lg px-6 py-4 min-w-64"
            >
              <h3 className="text-[20px] text-[#525463] font-semibold">
                {remind.title}
              </h3>
              <p className="text-gray-scale-500">{remind.content}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 메인 대시보드 레이아웃 */}
      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 bg-white rounded-lg p-4 mr-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h3 className="text-[20px] text-[#525463] font-semibold">
                오늘의 할 일
              </h3>
              <p className="text-[#525463]">{REMIND_DATA.length}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-[#A9ABB8]">수정하기</p>
              <button className="p-2 bg-gray-scale-200 rounded-full">
                <Plus size={18} className="text-blue" />
              </button>
            </div>
          </div>

          {/* 여기서 날짜 포맷은 한글 형식으로 유지 */}
          <div className="my-8 font-semibold">
            {year}년 {month}월 {date}일
          </div>

          <TodayCompleteChart />

          {/* 할 일 목록 */}
          <TodayList />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-4 h-auto md:h-[740px] lg:h-[600px] mt-4 lg:mt-0">
          <div className="h-1/2 w-full">
            <DailyCompletionChart title="할 일 완료 분석" />
          </div>
          <div className="h-1/2 w-full">
            <DailyCompletionChart title="뽀모도로 시간 분석" />
          </div>
        </div>
      </div>
    </div>
  );
}
