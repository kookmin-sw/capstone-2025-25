import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bot, Calendar, SquareArrowOutUpRight } from 'lucide-react';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { EisenhowerBase } from '@/types/commonTypes';
import { Category } from '@/types/category.ts';
import { eisenhowerService } from '@/services/eisenhowerService.ts';
import CheckFillIcon from '@/assets/eisenhower/check_fill.svg';
import CheckOutlineIcon from '@/assets/eisenhower/check_outline.svg';
import type { EisenhowerTask } from '@/types/api/eisenhower';
import { Modal } from '@/components/common/Modal.tsx';
import { Button } from '@/components/ui/button.tsx';
import { DialogClose } from '@radix-ui/react-dialog';
import { showToast } from '@/components/common/Toast.tsx';
import useCreateTodayTask from '@/hooks/queries/today/useCreateTodayTask';
import EisenhowerAi from '@/components/ui/Modal/EisenhowerAi.tsx';

type TaskCardVariant = 'default' | 'inactive' | 'done';

interface TaskCardProps {
  task: EisenhowerBase;
  categories: Category[];
  onClick?: () => void;
  layout?: 'matrix' | 'board';
  dragHandle?: 'full';
  className?: string;
  variant?: TaskCardVariant;
  onUpdateTask?: (task: EisenhowerTask) => void;
}

export function TaskCard({
  task,
  categories,
  layout = 'matrix',
  dragHandle,
  className,
  variant = 'default',
  onUpdateTask,
}: TaskCardProps) {
  const { id, title, memo } = task;
  const dueDate = task.dueDate;
  // const category = task.categoryId
  //   ? categories.find((cat) => cat.id === task.categoryId)
  //   : null;
  const category = categories.find((cat) => cat.id === task.categoryId) ?? null;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { ...task } });

  const { createTodoTaskMutation } = useCreateTodayTask();

  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleTaskComplete = async (e: MouseEvent) => {
    e.stopPropagation();

    if (variant === 'default' || variant === 'done') {
      const wasCompleted = task.isCompleted;

      try {
        const updated = await eisenhowerService.update(task.id, {
          isCompleted: !wasCompleted,
        });

        onUpdateTask?.({
          ...task,
          ...updated.content,
        });

        // toast.success(
        //   wasCompleted ? '완료를 취소했습니다' : '할 일을 완료했습니다',
        // );

        showToast(
          'success',
          wasCompleted ? '완료를 취소했습니다' : '할 일을 완료했습니다',
        );
      } catch (err) {
        console.error('완료 상태 업데이트 실패:', err);
      }
    }
  };

  const handleCreateTodayTask = (id: number) => {
    createTodoTaskMutation(id, {
      onSuccess: (data) => {
        if (data.statusCode === 500) {
          showToast('error', `${data.error}`);

          return;
        }

        showToast('success', '오늘의 할 일에 추가했어요!');
      },
    });
  };

  return (
    <div
      className="group w-full select-none"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'manipulation',
      }}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...(dragHandle === 'full' && variant === 'default' ? listeners : {})}
        className={cn(
          'rounded-md p-5 flex flex-col relative transition-all duration-200',
          layout === 'board' ? 'w-full' : '',
          variant === 'default' && !isDragging && 'hover:shadow-md',
          variant === 'default'
            ? 'bg-white border border-gray-100 cursor-pointer'
            : 'bg-white border border-gray-300 cursor-default shadow-none',
          isDragging &&
            'opacity-50 z-10 shadow-lg border-2 border-purple-300 cursor-grabbing',
          className,
        )}
      >
        {/* 상단 도구 아이콘 */}
        <div className="absolute top-5 right-5 flex gap-4">
          {variant === 'default' && (
            <div className=" transition-opacity flex gap-4 items-center">
              <div onClick={(e) => e.stopPropagation()}>
                <EisenhowerAi
                  trigger={
                    <div className="text-blue hover:text-gray-600 transition-colors w-[22px] ">
                      <Bot />
                    </div>
                  }
                  linkedEisenhower={task}
                  onApply={(updatedTask) => {
                    onUpdateTask?.(updatedTask as EisenhowerTask);
                  }}
                />
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <Modal
                  trigger={
                    <div className="text-blue hover:text-gray-600 transition-colors w-[22px] ">
                      <SquareArrowOutUpRight />
                    </div>
                  }
                  title="오늘의 할 일을 추가"
                  children={
                    <div className="rounded-[16px] px-6 py-[20px] text-[20px] bg-blue-2 flex gap-2 items-start text-gray-scale-700">
                      {title}을(를) 오늘의 할 일로 추가할까요?
                    </div>
                  }
                  footer={
                    <DialogClose asChild>
                      <div className="flex justify-end">
                        <Button
                          variant="blue"
                          onClick={() => handleCreateTodayTask(task.id)}
                        >
                          추가하기
                        </Button>
                      </div>
                    </DialogClose>
                  }
                ></Modal>
              </div>
              {/*{dragHandle !== 'full' && (*/}
              {/*  <div {...listeners} className="cursor-move">*/}
              {/*    <span className="text-xs text-[#6E726E] hover:text-gray-600">*/}
              {/*      <GripVertical />*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*)}*/}
            </div>
          )}
          <div
            onClick={handleTaskComplete}
            className={cn(
              'check-icon w-[24px] h-[24px] rounded-full flex-shrink-0 flex items-center justify-center cursor-pointer',
              // variant === 'done' ? 'bg-blue text-white' : 'border border-blue',
            )}
          >
            {variant === 'done' ? (
              // <Check className="w-3 h-3 text-white" />
              <img src={CheckFillIcon} alt="check-fill" />
            ) : (
              // <Check className="w-3 h-3 text-blue" />
              <img src={CheckOutlineIcon} alt="check-outline" />
            )}
          </div>
        </div>

        <div className="pr-26">
          {/* 카테고리 */}
          {category && (
            <div className="flex mb-2 flex-wrap">
              <CategoryBadge label={category.title} bgColor={category.color} />
            </div>
          )}

          <div className="flex items-center mb-2 flex-grow">
            <div
              className={cn(
                'text-md font-medium line-clamp-2 min-w-10 overflow-hidden text-ellipsis whitespace-nowrap',
                variant === 'done' ? 'text-gray-500' : 'text-black',
              )}
            >
              <p className="overflow-hidden text-ellipsis">{title}</p>
            </div>
          </div>

          {/* 메모 */}
          <div className="text-xs mb-2 line-clamp-2 text-[#858899] ">
            {memo ? (
              <p className="overflow-hidden text-ellipsis">{memo}</p>
            ) : (
              <>비어 있음</>
            )}
          </div>

          {/* 마감일 */}
          <div className="text-[14px] flex items-center mt-auto text-[#525463] ">
            {dueDate ? (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-[#525463] " />
                <span className="text-center pt-[1px] text-[14px] text-[#525463] whitespace-nowrap">
                  {dueDate}
                  {/*{format(new Date(dueDate), 'yyyy.MM.dd')}*/}
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-[#525463] " />
                <span className="text-center pt-[1px] text-[14px] text-[#525463]  whitespace-nowrap">
                  날짜 없음
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
