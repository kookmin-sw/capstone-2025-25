import { useMemo, useState } from 'react';
// import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import { Calendar, Loader2 } from 'lucide-react';
import { ReactNode } from 'react';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import CheckOutlineIcon from '@/assets/eisenhower/check_outline.svg';
import { EisenhowerBase, Quadrant } from '@/types/commonTypes';
import { useEisenhowerAiRecommendation } from '@/hooks/queries/eisenhower/useEisenhowerAiRecommendation';
import { useCategoryStore } from '@/store/useCategoryStore.ts';
import { Task } from '@/types/task.ts';
import { eisenhowerService } from '@/services/eisenhowerService.ts';
import * as Dialog from '@radix-ui/react-dialog';
import q1Image from '@/assets/q1.svg';
import q2Image from '@/assets/q2.svg';
import q3Image from '@/assets/q3.svg';
import q4Image from '@/assets/q4.svg';
import {
  DialogDescription,
  DialogHeader,
  DialogContent,
} from '@/components/ui/Dialog.tsx';
import { SECTION_TITLES } from '@/constants/eisenhower.ts';

interface Props {
  trigger: ReactNode;
  linkedEisenhower: EisenhowerBase & { categoryId?: number | null };

  onClose?: () => void;
  onApply?: (updatedTask: Task) => void;
}

export default function EisenhowerAi({
  trigger,
  linkedEisenhower,
  onClose,
  onApply,
}: Props) {
  const { title, quadrant, dueDate, categoryId } = linkedEisenhower;
  const [isOpen, setIsOpen] = useState(false);
  const formattedDueDate = useMemo(() => {
    if (!dueDate) return '';
    return new Date(dueDate).toISOString().split('T')[0];
  }, [dueDate]);

  const { recommendation, isLoading } = useEisenhowerAiRecommendation({
    title,
    currentQuadrant: quadrant,
    dueDate: formattedDueDate,
    isOpen,
  });

  const { categories } = useCategoryStore();
  const category = categoryId
    ? categories.find((c) => c.id === categoryId)
    : null;

  const handleApply = async () => {
    if (!recommendation || recommendation.isSameAsCurrent) {
      onClose?.();
      return;
    }

    try {
      const updated = await eisenhowerService.update(linkedEisenhower.id, {
        quadrant: recommendation.recommendedQuadrant as Quadrant,
      });

      const updatedTask = {
        ...linkedEisenhower,
        ...updated.content,
        quadrant: recommendation.recommendedQuadrant as Quadrant,
      };

      await eisenhowerService.updateOrder([
        {
          eisenhowerItemId: updatedTask.id,
          quadrant: recommendation.recommendedQuadrant as Quadrant,
          order: 9999, // 맨 끝에 추가 (필요 시 0으로)
        },
      ]);

      onApply?.(updatedTask);
      onClose?.();
    } catch (err) {
      console.error('우선순위 적용 실패', err);
    }
  };

  const quadrantIconMap: Record<Quadrant, string> = {
    Q1: q1Image,
    Q2: q2Image,
    Q3: q3Image,
    Q4: q4Image,
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
        <DialogContent className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 z-50">
          <DialogHeader>
            <div className="flex gap-1 flex-col mb-2">
              <p className="text-xl font-semibold">AI 추천 결과</p>
              <DialogDescription>
                <p className="text-[#525463]">
                  AI가 추천한 최적의 우선순위를 참고하여 작업을 배치해 보세요
                </p>
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-4 bg-[#EDF3FF] rounded-lg text-sm text-[#2F3A4B]">
              {recommendation?.recommendedQuadrant ? (
                <div className="w-12 h-12 rounded grid place-items-center text-blue-600">
                  <img
                    src={
                      quadrantIconMap[
                        recommendation.recommendedQuadrant as Quadrant
                      ]
                    }
                    alt={recommendation.recommendedQuadrant}
                    className="w-12 h-12"
                  />
                </div>
              ) : (
                // <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <div></div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center w-full">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : (
                <>
                  <p>
                    <strong>
                      ‘
                      {recommendation?.recommendedQuadrant &&
                        SECTION_TITLES[
                          recommendation.recommendedQuadrant as Quadrant
                        ]}
                      ’
                    </strong>
                    로 추천되었어요! 이 일정은 {recommendation?.reason}
                  </p>
                </>
              )}
            </div>

            {/* 카드 요약 정보 */}
            <div className="rounded-xl border border-blue-400 p-4 relative">
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                <img src={CheckOutlineIcon} alt="check-outline" />
              </div>

              {category && (
                <CategoryBadge
                  label={category.title}
                  bgColor={category.color}
                />
              )}

              <div className="text-sm font-semibold text-[#2F3A4B]">
                {linkedEisenhower.title}
              </div>

              <div className="text-xs text-[#868B94] line-clamp-2 mt-1">
                {linkedEisenhower.memo || '메모를 입력해주세요'}
              </div>

              {linkedEisenhower.dueDate && (
                <div className="text-xs text-[#525463] flex items-center mt-2">
                  <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                  {new Date(linkedEisenhower.dueDate).toLocaleDateString(
                    'ko-KR',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    },
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 푸터 버튼 */}
          <div className="mt-6 text-right">
            <DialogClose asChild>
              <Button variant="blue" onClick={handleApply}>
                적용하기
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog.Root>
  );
}
