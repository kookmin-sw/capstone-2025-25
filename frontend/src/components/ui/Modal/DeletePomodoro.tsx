import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import {  Timer } from 'lucide-react';
import { MultiSlider } from '@/components/ui/MultiSlider.tsx';
import { LinkedUnlinkedPomodoro } from '@/types/pomodoro';
import {ReactNode} from "react";

export default function DeletePomodoro({
  trigger,
  linkedUnlinkedPomodoro,
  isOpen,
  onOpenChange,
}: {
  trigger: ReactNode;
  linkedUnlinkedPomodoro: LinkedUnlinkedPomodoro;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { pomodoro, eisenhower } = linkedUnlinkedPomodoro;
  const totalExecutedTime = pomodoro.executedCycles.reduce(
    (sum, cycle) => sum + cycle.workDuration + (cycle.breakDuration ?? 0),
    0,
  );

  const deletePomodoro = () => {
    // 삭제 api 추가
    console.log("deletePomodoro");
  };

  return (
    <Modal
      trigger={trigger}
      isOpen={isOpen}
      title="뽀모도로를 삭제할까요?"
      description={`삭제 후 새로운 뽀모도로를 실행할 수 있어요`}
      onOpenChange={onOpenChange}
      footer={
        <div className="w-full flex justify-end">
          <div className="flex w-full justify-between gap-4">
            <Button variant="white" className="px-8 flex-1" onClick={()=>{onOpenChange(false)}}>
              취소하기
            </Button>
            <Button className="px-8 w-full flex-1" onClick={deletePomodoro}>
              삭제하기
            </Button>
          </div>
        </div>
      }
    >
      <>
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
            <div className=" bg-[#F2F2F2] rounded-[10px] px-[25px] py-[20px] h-[87px]">
              <MultiSlider
                min={0}
                max={totalExecutedTime}
                step={1}
                cycles={pomodoro.executedCycles}
                readonly={true}
              />
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
}
