import useGetCategoryList from '@/hooks/queries/category/useGetCategoryList';
import useGetTodayTodoList from '@/hooks/queries/today/useGetTodayTodoList';
import useGetYesterdayTodoList from '@/hooks/queries/today/useGetYesterdayTodoList';
import useMoveToday from '@/hooks/queries/today/useMoveToday';
import { cn } from '@/lib/utils';
import { Calendar, Trash2 } from 'lucide-react';
import { usePomodoroStore } from '@/store/pomodoro';
import usePatchPomodoro from '@/hooks/queries/pomodoro/usePatchPomodoro.ts';
import { toast } from 'sonner';
import useUpdateStatusTodo from '@/hooks/queries/today/useUpdateStatusTodo';
import useDeleteTodayTodo from '@/hooks/queries/today/useDeleteTodayTodo';
import CheckIcon from '@/assets/check.svg';
import CheckFillIcon from '@/assets/check-fill.svg';

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
  const { deleteTodayTodoMutation } = useDeleteTodayTodo();

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

  const handleDeleteTask = (id: number, title: string) => {
    deleteTodayTodoMutation(id, {
      onSuccess: () => {
        toast.success(`"${title}"을 오늘의 할 일에서 삭제했습니다.`);
      },
    });
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
            className="flex flex-col gap-4 py-5 rounded-lg bg-gray-scale-200"
          >
            <div className="px-5 flex items-center justify-between">
              <div className="px-3 py-[6px] bg-blue-2 text-gray-scale-900 inline-block rounded-full">
                {getCategoryNameById(todo.category_id)}
              </div>
              <img src={CheckIcon} className="w-6 h-6 cursor-pointer" />
            </div>
            <p className="px-6 text-[20px] text-[#525463] font-semibold">
              {todo.title}
            </p>
            <p className="px-6 text-[14px] text-[#858899]">{todo.memo}</p>
            <div className="px-6 flex items-center gap-2">
              <Calendar size={24} />
              <p className="text-[14px] text-[#525463]">
                {formatDateToEnglish(todo.dueDate)}
              </p>
            </div>
            <div className="flex justify-end mb-5 px-6">
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
          className="flex flex-col gap-4 py-5 rounded-lg bg-white border border-blue"
        >
          <div className="px-5 flex items-center justify-between">
            <div className="px-3 py-[6px] bg-blue-2 text-gray-scale-900 inline-block rounded-full">
              {getCategoryNameById(todo.category_id)}
            </div>
            <div className="flex items-center gap-2">
              <Trash2
                className="cursor-pointer text-gray-400 hover:text-red-500"
                size={24}
                onClick={() => handleDeleteTask(todo.id, todo.title)}
                color="#7098ff"
              />
              <img
                src={todo.isCompleted ? CheckFillIcon : CheckIcon}
                className="w-6 h-6 cursor-pointer"
                onClick={() =>
                  handleCompleteTask(todo.id, todo.isCompleted, todo.title)
                }
              />
            </div>
          </div>
          <p className="px-6 text-[20px] text-[#525463] font-semibold">
            {todo.title}
          </p>
          <p className="px-6 text-[14px] text-[#858899]">{todo.memo}</p>
          <div className="px-6 flex items-center gap-2">
            <Calendar size={24} />
            <p className="text-[14px] text-[#525463]">
              {formatDateToEnglish(todo.dueDate)}
            </p>
          </div>
          <div className="flex justify-end mb-5 px-6">
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
        <div className="bg-white px-4 py-8 rounded-md flex flex-col items-center justify-center text-center min-h-[200px]">
          <p className="font-semibold">
            {hideCompleted && todayTodoList && todayTodoList.length > 0
              ? '완료되지 않은 일이 없어요'
              : '아직 오늘의 할 일이 없어요'}
          </p>
          <p className="text-[14px] text-[#525463] mt-2 cursor-pointer hover:text-blue">
            오늘의 할 일 추가하기 {'>'}
          </p>
        </div>
      )}
    </div>
  );
}
