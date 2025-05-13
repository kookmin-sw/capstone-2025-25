import TodayList from '@/components/today/TodayList';
import { DailyCompletionChart } from '@/components/ui/chart/DailyCompletionChart';
import { TodayCompleteChart } from '@/components/ui/chart/TodayCompleteChart';
import { PomodoroCard } from '@/components/today/PomodoroCard';
import useGetTodayTodoCompletedCount from '@/hooks/queries/today/useGetTodayTodoCompletedCount';
import useGetTodayTodoCount from '@/hooks/queries/today/useGetTodayTodoCount';
import { usePomodoroStore } from '@/store/pomodoro.ts';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router';
import { PomodoroCompletionChart } from '@/components/ui/chart/PomodoroCompletionChar';
import PlusIcon from '@/assets/plus.svg';

export default function TodayMainDashborad() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  const [hideCompleted, setHideCompleted] = useState(false);
  const navigate = useNavigate();
  const { todayTodoCount } = useGetTodayTodoCount();
  const { todayTodoCompletedCount } = useGetTodayTodoCompletedCount();
  const currentId = usePomodoroStore((s) => s.id);

  const handleRouteToEisenhower = () => {
    navigate('/matrix');
  };

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4">
      {currentId && (
        <div className="w-full block lg:hidden">
          <PomodoroCard />
        </div>
      )}

      <div className="w-full lg:w-1/2 flex flex-col gap-8 bg-white rounded-lg px-6 py-4 h-auto lg:h-fit overflow-auto self-start">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h3 className="text-[20px] text-[#525463] font-semibold">
              오늘의 할 일
            </h3>
            {todayTodoCount && (
              <p className="text-[#525463]">{todayTodoCount}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-gray-scale-200 rounded-full cursor-pointer">
              <img src={PlusIcon} onClick={handleRouteToEisenhower} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="font-semibold text-[#525463]">
            {year}년 {month}월 {date}일
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-scale-700">완료된 일 숨기기</p>
            <Switch
              checked={hideCompleted}
              onCheckedChange={setHideCompleted}
              className="data-[state=checked]:bg-blue"
            />
          </div>
        </div>

        <div>
          {todayTodoCount !== undefined && todayTodoCount > 0 && (
            <TodayCompleteChart
              totalCount={todayTodoCount}
              completedCount={todayTodoCompletedCount ?? 0}
            />
          )}

          <TodayList hideCompleted={hideCompleted} />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col gap-4 h-auto mt-4 lg:mt-0">
        {currentId && (
          <div className="w-full hidden lg:block">
            <PomodoroCard />
          </div>
        )}
        <div className="w-full">
          <DailyCompletionChart title="할 일 완료 분석" />
        </div>
        <div className="w-full">
          <PomodoroCompletionChart title="뽀모도로 시간 분석" />
        </div>
      </div>
    </div>
  );
}
