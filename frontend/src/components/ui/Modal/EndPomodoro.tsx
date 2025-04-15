import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';
import { MultiSlider } from '@/components/ui/MultiSlider.tsx';
import { PomodoroCycle, Eisenhower } from '@/types/pomodoro';
import { DialogClose } from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

type EndPomodoroProps = {
  trigger: ReactNode;
  eisenhower: Eisenhower | null;
  cycles: PomodoroCycle[];
  handleContinue: (open: boolean) => void;
};

export default function EndPomodoro({
  trigger,
  eisenhower,
  cycles,
  handleContinue,
}: EndPomodoroProps) {
  const totalExecutedTime = cycles?.reduce(
    (sum, cycle) => sum + cycle.workDuration + (cycle.breakDuration ?? 0),
    0,
  );

  const finishPomodoro = () => {
    // 완료 API 추가
  };

  return (
    <Modal
      trigger={trigger}
      title="뽀모도로를 완료할까요?"
      description="지금까지의 진행 시간이 기록돼요"
      footer={
        <div className="w-full flex justify-end">
          <div className="flex w-full flex items-center justify-between gap-4">
            <DialogClose asChild>
              <Button
                size="sm"
                variant="white"
                className="flex-1"
                onClick={() => handleContinue(true)}
              >
                취소하기
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                size="sm"
                className="w-full flex-1"
                onClick={finishPomodoro}
              >
                완료하기
              </Button>
            </DialogClose>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-[33px]">
        {eisenhower ? (
          <div className="h-[153px] border-1"></div>
        ) : (
          <div className="flex px-4 py-4 border-1 border-[#E5E5E5] gap-2.5 rounded-[7px] items-center">
            <Timer className="text-primary-100" />
            <p className="text-[16px] h-[18px] font-semibold">title</p>
          </div>
        )}
        <div className="flex flex-col gap-[10px]">
          <div className="bg-[#F2F2F2] rounded-[7px] px-[25px] py-[20px] h-[87px]">
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
