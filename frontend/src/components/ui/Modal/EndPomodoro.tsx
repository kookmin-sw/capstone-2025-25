import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';
import { MultiSlider } from '@/components/ui/MultiSlider.tsx';
import { PomodoroCycle, Eisenhower } from '@/types/pomodoro';

type EndPomodoroProps = {
  eisenhower: Eisenhower | null;
  cycles: PomodoroCycle[] ;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
};

export default function EndPomodoro({
  eisenhower,
  cycles,
  isOpen,
  onOpenChange,
  onComplete,
}: EndPomodoroProps) {
  const totalExecutedTime = cycles?.reduce(
    (sum, cycle) => sum + cycle.workDuration + (cycle.breakDuration ?? 0),
    0,
  );

  const finishPomodoro = () => {
    // 완료 API 추가
    onComplete();
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      title="뽀모도로를 완료할까요?"
      description="지금까지의 진행 시간이 기록돼요"
      onOpenChange={onOpenChange}
      footer={
        <div className="w-full flex justify-end">
          <div className="flex w-full justify-between gap-4">
            <Button
              variant="white"
              className="px-8 flex-1"
              onClick={() => onOpenChange(false)}
            >
              취소하기
            </Button>
            <Button className="px-8 w-full flex-1" onClick={finishPomodoro}>
              완료하기
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-[33px]">
        {eisenhower ? (
          <div className="h-[153px] border-1"></div>
        ) : (
          <div className="flex px-4 py-4 border-1 border-[#E5E5E5] gap-2.5 rounded-[10px]">
            <Timer className="text-primary-100" />
            <p className="text-[16px] font-semibold">title</p>
          </div>
        )}
        <div className="flex flex-col gap-[10px]">
          <div className="bg-[#F2F2F2] rounded-[10px] px-[25px] py-[20px] h-[87px]">
            <MultiSlider
              min={0}
              max={totalExecutedTime}
              step={1}
              cycles={cycles}
              readonly={true}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
