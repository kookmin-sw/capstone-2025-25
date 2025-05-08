import useGetTodayTodoList from '@/hooks/queries/today/useGetTodayTodoList';
import useGetYesterdayTodoList from '@/hooks/queries/today/useGetYesterdayTodoList';
import useMoveToday from '@/hooks/queries/today/useMoveToday';
import { cn } from '@/lib/utils';
import { Calendar, Check } from 'lucide-react';

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

export default function TodayList() {
  const { todayTodoList } = useGetTodayTodoList();
  const { yesterdayTodoList } = useGetYesterdayTodoList();
  const { moveTodayMutation, isPending } = useMoveToday();

  const handleMoveToToday = (id: number) => {
    moveTodayMutation(id);
  };

  return (
    <div className="mt-4 space-y-4">
      {yesterdayTodoList &&
        yesterdayTodoList.map((todo) => (
          <div
            key={todo.id}
            className="p-3 px-6 py-5 rounded-lg bg-gray-scale-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="px-3 py-[6px] bg-blue-2 text-gray-scale-900 inline-block rounded-full">
                {todo.category_id}
              </div>
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center p-1',
                  todo.isCompleted
                    ? 'bg-blue'
                    : 'bg-transparent border-2 border-blue',
                )}
              >
                <Check
                  className={cn(todo.isCompleted ? 'text-white' : 'text-blue')}
                  size={24}
                />
              </div>
            </div>
            <p className="text-[20px] text-[#525463] font-semibold">
              {todo.title}
            </p>
            <p className="text-[14px] text-[#858899] my-2">{todo.memo}</p>
            <div className="flex items-center gap-2">
              <Calendar size={24} />
              <p className="text-[14px] text-[#525463]">
                {formatDateToEnglish(todo.dueDate)}
              </p>
            </div>
            <div className="flex justify-end mt-2">
              <button
                className="px-4 py-2 rounded-full bg-white text-blue font-semibold"
                onClick={() => handleMoveToToday(todo.id)}
                disabled={isPending}
              >
                오늘 일정에 추가하기
              </button>
            </div>
          </div>
        ))}

      {todayTodoList &&
        todayTodoList.map((todo) => (
          <div
            key={todo.id}
            className="p-3 px-6 py-5 rounded-lg bg-white border border-blue"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="px-3 py-[6px] bg-blue-2 text-gray-scale-900 inline-block rounded-full">
                {todo.category_id}
              </div>
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center p-1',
                  todo.isCompleted
                    ? 'bg-blue'
                    : 'bg-transparent border-2 border-blue',
                )}
              >
                <Check
                  className={cn(todo.isCompleted ? 'text-white' : 'text-blue')}
                  size={24}
                />
              </div>
            </div>
            <p className="text-[20px] text-[#525463] font-semibold">
              {todo.title}
            </p>
            <p className="text-[14px] text-[#858899] my-2">{todo.memo}</p>
            <div className="flex items-center gap-2">
              <Calendar size={24} />
              <p className="text-[14px] text-[#525463]">
                {formatDateToEnglish(todo.dueDate)}
              </p>
            </div>
            <div className="flex justify-end mt-2">
              <button
                className={cn(
                  'px-4 py-2 rounded-full text-white font-semibold',
                  todo.isCompleted
                    ? 'bg-gray-scale-400 text-gray-scale-200'
                    : 'bg-blue text-white',
                )}
              >
                뽀모도로 시작하기
              </button>
            </div>
          </div>
        ))}
      {todayTodoList && todayTodoList.length === 0 && (
        <div className="bg-white px-4 py-2 rounded-md">
          <p className="font-semibold">아직 오늘의 할 일이 없어요</p>
          <p className="text-[14px] text-[#525463]">
            오늘의 할 일 추가하기 {'>'}
          </p>
        </div>
      )}
    </div>
  );
}
