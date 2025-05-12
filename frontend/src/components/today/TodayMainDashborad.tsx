import TodayList from '@/components/today/TodayList';
import { DailyCompletionChart } from '@/components/ui/chart/DailyCompletionChart';
import { TodayCompleteChart } from '@/components/ui/chart/TodayCompleteChart';
import { PomodoroCard } from '@/components/today/PomodoroCard';
import useGetTodayTodoCompletedCount from '@/hooks/queries/today/useGetTodayTodoCompletedCount';
import useGetTodayTodoCount from '@/hooks/queries/today/useGetTodayTodoCount';
import { Plus } from 'lucide-react';
import { usePomodoroStore } from '@/store/pomodoro.ts';
import { useIsMobile } from '@/hooks/use-mobile.ts';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

export default function TodayMainDashborad() {
  const isMobile = useIsMobile();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  const [hideCompleted, setHideCompleted] = useState(false);

  const { todayTodoCount } = useGetTodayTodoCount();
  const { todayTodoCompletedCount } = useGetTodayTodoCompletedCount();
  const currentId = usePomodoroStore((s) => s.id);

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4">
      {isMobile && currentId && (
        <div className=" w-full">
          <PomodoroCard />
        </div>
      )}
      <div className="w-full lg:w-1/2 bg-white rounded-lg p-4 lg:mr-4 h-auto lg:min-h-[616px] overflow-auto">
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
            <button className="p-2 bg-gray-scale-200 rounded-full cursor-pointer">
              <Plus size={18} className="text-blue" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="my-8 font-semibold">
            {year}년 {month}월 {date}일
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[14px] text-gray-scale-700">완료된 일 숨기기</p>
            <Switch
              checked={hideCompleted}
              onCheckedChange={setHideCompleted}
              className="data-[state=checked]:bg-blue"
            />
          </div>
        </div>

        <TodayCompleteChart
          totalCount={todayTodoCount ?? 0}
          completedCount={todayTodoCompletedCount ?? 0}
        />
        <TodayList hideCompleted={hideCompleted} />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col gap-4 h-auto md:h-[740px] lg:h-[600px] mt-4 lg:mt-0">
        {!isMobile && currentId && (
          <div className=" w-full">
            <PomodoroCard />
          </div>
        )}
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
