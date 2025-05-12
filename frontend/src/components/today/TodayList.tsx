import useGetCategoryList from '@/hooks/queries/category/useGetCategoryList';
import useGetTodayTodoList from '@/hooks/queries/today/useGetTodayTodoList';
import useGetYesterdayTodoList from '@/hooks/queries/today/useGetYesterdayTodoList';
import useMoveToday from '@/hooks/queries/today/useMoveToday';
import { cn } from '@/lib/utils';
import { Calendar, Check } from 'lucide-react';
import { usePomodoroStore } from '@/store/pomodoro';
import usePatchPomodoro from '@/hooks/queries/pomodoro/usePatchPomodoro.ts';
import { toast } from 'sonner';
import useUpdateStatusTodo from '@/hooks/queries/today/useUpdateStatusTodo';

interface TodayListProps {
  hideCompleted?: boolean;
}

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

export default function TodayList({ hideCompleted = false }: TodayListProps) {
  const { todayTodoList } = useGetTodayTodoList();
  const { yesterdayTodoList } = useGetYesterdayTodoList();
  const { getCategoryNameById } = useGetCategoryList();
  const { moveTodayMutation, isPending } = useMoveToday();
  const { patchPomodoroMutation } = usePatchPomodoro();
  const { updateStatusMutation } = useUpdateStatusTodo();

  const handleMoveToToday = (id: number) => {
    moveTodayMutation(id);
  };

  const setTimer = usePomodoroStore((s) => s.setTimer);
  const handleDelete = (id: number, title: string) => {
    setTimer(id, title, patchPomodoroMutation);
  };

  const handleCompleteTask = (
    id: number,
    isCompleted: boolean,
    title: string,
  ) => {
    const newCompletedState = !isCompleted;

    updateStatusMutation(
      {
        id,
        data: {
          isCompleted: newCompletedState,
        },
      },
      {
        onSuccess: () => {
          if (newCompletedState) {
            toast.success(`"${title}"을(를) 완료했습니다`);
          } else {
            toast.info(`"${title}"을(를) 미완료 상태로 변경했습니다`);
          }
        },
      },
    );
  };

  const filteredTodayTodoList = todayTodoList
    ? hideCompleted
      ? todayTodoList.filter((todo) => !todo.isCompleted)
      : todayTodoList
    : [];

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
                {getCategoryNameById(todo.category_id)}
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
                  className={cn(
                    'cursor-pointer',
                    todo.isCompleted ? 'text-white' : 'text-blue',
                  )}
                  size={24}
                  onClick={() =>
                    handleCompleteTask(todo.id, todo.isCompleted, todo.title)
                  }
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
                className="px-4 py-2 rounded-full bg-white text-blue font-semibold cursor-pointer"
                onClick={() => handleMoveToToday(todo.id)}
                disabled={isPending}
              >
                오늘 일정에 추가하기
              </button>
            </div>
          </div>
        ))}

      {filteredTodayTodoList.map((todo) => (
        <div
          key={todo.id}
          className="p-3 px-6 py-5 rounded-lg bg-white border border-blue"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="px-3 py-[6px] bg-blue-2 text-gray-scale-900 inline-block rounded-full">
              {getCategoryNameById(todo.category_id)}
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
                className={cn(
                  'cursor-pointer',
                  todo.isCompleted ? 'text-white' : 'text-blue',
                )}
                size={24}
                onClick={() =>
                  handleCompleteTask(todo.id, todo.isCompleted, todo.title)
                }
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
                'px-4 py-2 rounded-full text-white font-semibold cursor-pointer',
                todo.isCompleted
                  ? 'bg-gray-scale-400 text-gray-scale-200'
                  : 'bg-blue text-white',
              )}
              onClick={() => {
                handleDelete(todo.id, todo.title);
              }}
            >
              뽀모도로 시작하기
            </button>
          </div>
        </div>
      ))}
      {filteredTodayTodoList.length === 0 && (
        <div className="bg-white px-4 py-2 rounded-md">
          <p className="font-semibold">
            {hideCompleted && todayTodoList && todayTodoList.length > 0
              ? '완료되지 않은 일이 없어요'
              : '아직 오늘의 할 일이 없어요'}
          </p>
          <p className="text-[14px] text-[#525463]">
            오늘의 할 일 추가하기 {'>'}
          </p>
        </div>
      )}
    </div>
  );
}
