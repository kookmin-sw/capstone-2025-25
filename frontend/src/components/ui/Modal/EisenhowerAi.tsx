import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { Calendar } from 'lucide-react';
import { ReactNode } from 'react';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import CheckOutlineIcon from '@/assets/eisenhower/check_outline.svg';
import { useCategoryStore } from '@/store/useCategoryStore';
import { EisenhowerBase } from '@/types/commonTypes';

interface Props {
  trigger: ReactNode;
  linkedEisenhower: EisenhowerBase & { categoryId?: number | null };
}

export default function EisenhowerAi({ trigger, linkedEisenhower }: Props) {
  const { categories } = useCategoryStore();
  const category = linkedEisenhower.categoryId
    ? categories.find((c) => c.id === linkedEisenhower.categoryId)
    : null;

  return (
    <Modal
      trigger={trigger}
      footer={
        <DialogClose asChild>
          <Button variant="blue">적용하기</Button>
        </DialogClose>
      }
    >
      <div className="flex gap-1 flex-col mb-2">
        <p className="text-xl font-semibold">AI 추천 결과</p>
        <p className="text-[#525463]">
          AI가 추천한 최적의 우선순위를 참고하여 작업을 배치해 보세요
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* 추천 메시지 */}
        <div className="flex items-center gap-3 p-4 bg-[#EDF3FF] rounded-lg text-sm text-[#2F3A4B]">
          <div className="w-6 h-6 bg-blue-200 rounded grid place-items-center text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
          </div>
          <span>
            이 일정은 <strong>‘긴급하고 중요한 일’</strong>로 추천되었어요!
          </span>
        </div>

        {/* 카드 요약 정보 */}
        <div className="rounded-xl border border-blue-400 p-4 relative">
          {/* 체크 아이콘 */}
          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center">
            <img src={CheckOutlineIcon} alt="check-outline" />
          </div>

          {/* 카테고리 */}
          {category && (
            <CategoryBadge label={category.title} bgColor={category.color} />
          )}

          {/* 제목 */}
          <div className="text-sm font-semibold text-[#2F3A4B]">
            {linkedEisenhower.title}
          </div>

          {/* 메모 */}
          <div className="text-xs text-[#868B94] line-clamp-2 mt-1">
            {linkedEisenhower.memo || '메모를 입력해주세요'}
          </div>

          {/* 마감일 */}
          {linkedEisenhower.dueDate && (
            <div className="text-xs text-[#525463] flex items-center mt-2">
              <Calendar className="w-4 h-4 mr-1 text-blue-500" />
              {new Date(linkedEisenhower.dueDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
