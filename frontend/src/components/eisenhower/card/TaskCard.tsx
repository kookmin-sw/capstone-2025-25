import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Bot,
  Calendar,
  GripVertical,
  SquareArrowOutUpRight,
} from 'lucide-react';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { format } from 'date-fns';
import { MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { EisenhowerBase } from '@/types/commonTypes';
// import { Task } from '@/types/task.ts';
import { Category } from '@/types/category.ts';
import { eisenhowerService } from '@/services/eisenhowerService.ts';
import { toast } from 'sonner';
import CheckFillIcon from '@/assets/eisenhower/check_fill.svg';
import CheckOutlineIcon from '@/assets/eisenhower/check_outline.svg';
import type { EisenhowerTask } from '@/types/api/eisenhower';
import { Modal } from '@/components/common/Modal.tsx';
import { Button } from '@/components/ui/button.tsx';
import { DialogClose } from '@radix-ui/react-dialog';
import EisenhowerAi from '@/components/ui/Modal/EisenhowerAi.tsx';
import { todayService } from '@/services/todayService.ts';
import { showToast } from '@/components/common/Toast.tsx';
import useCreateTodayTask from '@/hooks/queries/today/useCreateTodayTask';

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
  onClick,
  layout = 'matrix',
  dragHandle,
  className,
  variant = 'default',
  onUpdateTask,
}: TaskCardProps) {
  const { id, title, memo } = task;
  const dueDate = task.dueDate;
  const category = task.categoryId
    ? categories.find((cat) => cat.id === task.categoryId)
    : null;

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

  const handleClick = (e: MouseEvent) => {
    const checkIcon = e.currentTarget.querySelector('.check-icon');
  };

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
    <div className="group w-full">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...(dragHandle === 'full' && variant === 'default' ? listeners : {})}
        onClick={handleClick}
        className={cn(
          'rounded-md p-4 flex flex-col relative transition-all duration-200',
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
        <div className="absolute p-2 top-1 right-1 flex gap-2">
          {variant === 'default' && (
            <div className=" transition-opacity flex gap-2 items-center">
              {/*<div onClick={(e) => e.stopPropagation()}>*/}
              {/*  <EisenhowerAi*/}
              {/*    trigger={*/}
              {/*      <div className="text-[#6E726E] hover:text-gray-600 transition-colors">*/}
              {/*        <Bot />*/}
              {/*      </div>*/}
              {/*    }*/}
              {/*    linkedEisenhower={task}*/}
              {/*  />*/}
              {/*</div>*/}

              <div onClick={(e) => e.stopPropagation()}>
                <Modal
                  trigger={
                    <div className="text-[#6E726E] hover:text-gray-600 transition-colors w-[22px]">
                      <SquareArrowOutUpRight />
                    </div>
                  }
                  children={
                    <div>매트릭스 페이지에서 오늘의 할 일을 추가할까요?</div>
                  }
                  footer={
                    <DialogClose asChild>
                      <Button
                        variant="blue"
                        onClick={() => handleCreateTodayTask(task.id)}
                      >
                        추가하기
                      </Button>
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
              'check-icon w-[24px] h-[24px] rounded-full mr-2 flex-shrink-0 flex items-center justify-center cursor-pointer',
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

        <div className="pr-16">
          {/* 카테고리 */}
          {category && (
            <div className="flex mb-2 flex-wrap">
              <CategoryBadge label={category.title} bgColor={category.color} />
            </div>
          )}

          <div className="flex items-center mb-2 flex-grow">
            <div
              className={cn(
                'text-md font-medium line-clamp-2',
                variant === 'done' ? 'text-gray-500' : 'text-black',
              )}
            >
              {title}
            </div>
          </div>

          {/* 메모 */}
          <div className="text-xs mb-2 line-clamp-2 text-[#858899] ">
            {memo ? memo : <>비어 있음</>}
          </div>

          {/* 마감일 */}
          <div className="text-xs flex items-center mt-auto text-[#525463] ">
            {dueDate ? (
              <div className="flex">
                <Calendar className="w-4 h-4 mr-1 text-blue" />
                <span className="text-center pt-[1px] text-xs">
                  {dueDate}
                  {/*{format(new Date(dueDate), 'yyyy.MM.dd')}*/}
                </span>
              </div>
            ) : (
              <div className="flex">
                <Calendar className="w-4 h-4 mr-1 text-blue" />
                <span className="text-center pt-[1px] text-xs">날짜 없음</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
