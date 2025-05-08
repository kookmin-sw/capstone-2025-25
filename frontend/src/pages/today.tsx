import { DailyCompletionChart } from '@/components/ui/chart/DailyCompletionChart';
import { TodayCompleteChart } from '@/components/ui/chart/TodayCompleteChart';
import { cn } from '@/lib/utils';
import { Calendar, Check, Plus } from 'lucide-react';

function formatDateToEnglish(dateString: string): string {
  if (typeof dateString === 'string') {
    const [yearStr, monthStr, dayStr] = dateString.split('-');

    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return '';
}

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
          <div className="mt-4 space-y-4">
            {REMIND_DATA.map((todo) => (
              <div
                key={todo.id}
                className={cn(
                  'p-3 px-6 py-5 rounded-lg',
                  todo.reminder
                    ? 'bg-gray-scale-200'
                    : 'bg-white border border-blue',
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="px-3 py-[6px] bg-blue-2 text-gray-scale-900 inline-block rounded-full">
                    {todo.category}
                  </div>
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center p-1',
                      todo.completed
                        ? 'bg-blue'
                        : 'bg-transparent border-2 border-blue',
                    )}
                  >
                    <Check
                      className={cn(
                        todo.completed ? 'text-white' : 'text-blue',
                      )}
                      size={24}
                    />
                  </div>
                </div>
                <p className="text-[20px] text-[#525463] font-semibold">
                  {todo.title}
                </p>
                <p className="text-[14px] text-[#858899] my-2">
                  {todo.content}
                </p>
                {/* 여기서 날짜 포맷만 영문 형식(Jan 20, 2022)으로 변경 */}
                <div className="flex items-center gap-2">
                  <Calendar size={24} />
                  <p className="text-[14px] text-[#525463]">
                    {formatDateToEnglish(todo.dueDate)}
                  </p>
                </div>
                <div className="flex justify-end mt-2">
                  {todo.reminder ? (
                    <button className="px-4 py-2 rounded-full bg-white text-blue font-semibold">
                      오늘 일정에 추가하기
                    </button>
                  ) : (
                    <button
                      className={cn(
                        'px-4 py-2 rounded-full  text-white font-semibold',
                        todo.completed
                          ? 'bg-gray-scale-400 text-gray-scale-200'
                          : 'bg-blue text-white',
                      )}
                    >
                      뽀모도로 시작하기
                    </button>
                  )}
                </div>
              </div>
            ))}
            {REMIND_DATA.length === 0 && (
              <div className="bg-white px-4 py-2 rounded-md">
                <p className="font-semibold">아직 오늘의 할 일이 없어요</p>
                <p className="text-[14px] text-[#525463]">
                  오늘의 할 일 추가하기 {'>'}
                </p>
              </div>
            )}
          </div>
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
