import TodayList from '@/components/today/TodayList';
import { DailyCompletionChart } from '@/components/ui/chart/DailyCompletionChart';
import { TodayCompleteChart } from '@/components/ui/chart/TodayCompleteChart';
import useGetTodayTodoCompletedCount from '@/hooks/queries/today/useGetTodayTodoCompletedCount';
import useGetTodayTodoCount from '@/hooks/queries/today/useGetTodayTodoCount';
import { Plus } from 'lucide-react';

export default function TodayMainDashborad() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  const { todayTodoCount } = useGetTodayTodoCount();
  const { todayTodoCompletedCount } = useGetTodayTodoCompletedCount();

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <div className="w-full lg:w-1/2 bg-white rounded-lg p-4 mr-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-[20px] text-[#525463] font-semibold">
              오늘의 할 일
            </h3>
            {todayTodoCount && (
              <p className="text-[#525463]">{todayTodoCount}</p>
            )}
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

        {todayTodoCount && todayTodoCompletedCount && (
          <TodayCompleteChart
            totalCount={todayTodoCount}
            completedCount={todayTodoCompletedCount}
          />
        )}

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
  );
}
