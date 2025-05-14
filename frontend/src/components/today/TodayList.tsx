import useGetCategoryList from '@/hooks/queries/category/useGetCategoryList';
import useGetTodayTodoList from '@/hooks/queries/today/useGetTodayTodoList';
import useGetYesterdayTodoList from '@/hooks/queries/today/useGetYesterdayTodoList';
import useMoveToday from '@/hooks/queries/today/useMoveToday';
import {cn} from '@/lib/utils';
import {Calendar, Trash2} from 'lucide-react';
import {usePomodoroStore} from '@/store/pomodoro';
import usePatchPomodoro from '@/hooks/queries/pomodoro/usePatchPomodoro.ts';
import useUpdateStatusTodo from '@/hooks/queries/today/useUpdateStatusTodo';
import useDeleteTodayTodo from '@/hooks/queries/today/useDeleteTodayTodo';
import CheckIcon from '@/assets/check.svg';
import CheckFillIcon from '@/assets/check-fill.svg';
import {showToast} from '@/components/common/Toast.tsx';
import {useNavigate} from 'react-router';

interface TodayListProps {
    hideCompleted?: boolean;
}

function formatDateToEnglish(dateString: string | null): string {
    if (!dateString) return '날짜 없음';

    if (typeof dateString === 'string') {
        const [yearStr, monthStr, dayStr] = dateString.split('-');

        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);

        const date = new Date(year, month - 1, day);
        if (isNaN(date.getTime())) {
            return '날짜 없음';
        }

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    return '날짜 없음';
}

export default function TodayList({hideCompleted = false}: TodayListProps) {
    const {todayTodoList} = useGetTodayTodoList();
    const {yesterdayTodoList} = useGetYesterdayTodoList();

    const {getCategoryNameById} = useGetCategoryList();
    const {moveTodayMutation, isPending} = useMoveToday();
    const {patchPomodoroMutation} = usePatchPomodoro();
    const {updateStatusMutation} = useUpdateStatusTodo();
    const {deleteTodayTodoMutation} = useDeleteTodayTodo();

    const navigate = useNavigate();

    const handleMoveToToday = (id: number) => {
        moveTodayMutation(id);
    };

    const setTimer = usePomodoroStore((s) => s.setTimer);
    const currentId = usePomodoroStore((s) => s.id);
    const handleDelete = (id: number, title: string) => {
        if (currentId) {
            if (currentId === id) {

                return;
            } else {
                showToast('error', '이미 진행 중인 뽀모도로가 있습니다.');
                return;
            }
        }
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
                        showToast('success', `"${title}"을(를) 완료했습니다`);
                    } else {
                        showToast('success', `"${title}"을(를) 미완료 상태로 변경했습니다`);
                    }
                },
            },
        );
    };

    const deleteTimer = usePomodoroStore((s) => s.deleteTimer);


    const handleDeleteTask = (id: number, title: string) => {
        deleteTodayTodoMutation(id, {
            onSuccess: () => {
                showToast('success', `"${title}"을 오늘의 할 일에서 삭제했습니다.`)
                if(id==currentId){
                    deleteTimer(patchPomodoroMutation);
                }
            },
        });
    };

    const handleRouteToEisenhower = () => {
        navigate('/matrix');
    };

    const filteredTodayTodoList = todayTodoList
        ? hideCompleted
            ? todayTodoList.filter((todo) => !todo.isCompleted)
            : todayTodoList
        : [];

    const renderCategoryBadge = (categoryId: number | string) => {
        const categoryName = getCategoryNameById(categoryId);

        if (!categoryName) {
            return null;
        }

        return (
            <div className="inline-flex px-3 py-[3.5px] bg-blue-2 text-gray-scale-900 rounded-full mb-2 self-start">
                {categoryName}
            </div>
        );
    };

    const renderDate = (dueDate: string | null | undefined) => {
        return (
            <div className="flex items-center gap-2">
                <Calendar size={24} className='text-[#525463]'/>
                <p className="text-[14px] text-[#525463]">
                    {formatDateToEnglish(dueDate || null)}
                </p>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {yesterdayTodoList &&
                yesterdayTodoList.map((todo) => (
                    <div
                        key={todo.id}
                        className="relative flex flex-col gap-4 py-5 rounded-[16px] bg-gray-scale-200"
                    >
                        <div className="absolute top-5 right-5">
                            <img src={CheckIcon} className="w-6 h-6 cursor-pointer"/>
                        </div>

                        <div className="px-6 pr-20 flex flex-col items-start w-full gap-2">
                            {renderCategoryBadge(todo.category_id)}
                            <p className="text-[20px] text-[#525463] font-semibold w-full line-clamp-2 overflow-hidden">
                                {todo.title}
                            </p>
                            <p className="text-[14px] text-[#858899] w-full line-clamp-2 overflow-hidden">
                                {todo.memo}
                            </p>
                            {renderDate(todo.dueDate)}
                        </div>

                        <div className="flex justify-end px-6">
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
                    className="relative flex flex-col gap-4 py-5 rounded-[16px] bg-white border border-blue"
                >
                    <div className="absolute top-5 right-5 flex items-center gap-4">
                        <Trash2
                            className="cursor-pointer text-gray-400 "
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

                    <div className="px-6 pr-20 flex flex-col items-start w-full gap-2">
                        {renderCategoryBadge(todo.category_id)}
                        <p className="text-[20px] text-[#525463] font-semibold w-full line-clamp-2 overflow-hidden">
                            {todo.title}
                        </p>
                        <p className="text-[14px] text-[#858899] w-full line-clamp-2 overflow-hidden">
                            {todo.memo}
                        </p>
                        {renderDate(todo.dueDate)}
                    </div>


                    <div className="flex justify-end px-6">
                        <button
                            className={cn(
                                'px-4 py-[6px] rounded-full text-white font-semibold cursor-pointer',
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
                <div
                    className="bg-[#F0F0F5] px-4 py-8 rounded-md flex flex-col items-center justify-center min-h-[200px]">
                    <p className="font-semibold">
                        {hideCompleted && todayTodoList && todayTodoList.length > 0
                            ? '완료되지 않은 일이 없어요'
                            : '아직 오늘의 할 일이 없어요'}
                    </p>
                    <p
                        className="text-[14px] text-[#525463] mt-2 cursor-pointer hover:text-blue"
                        onClick={handleRouteToEisenhower}
                    >
                        오늘의 할 일 추가하기 {'>'}
                    </p>
                </div>
            )}
        </div>
    );
}
