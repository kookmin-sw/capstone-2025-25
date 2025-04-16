import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';
import { MultiSlider } from '@/components/ui/MultiSlider.tsx';
import { LinkedUnlinkedPomodoro } from '@/types/pomodoro';
import { DialogClose } from '@radix-ui/react-dialog';
import { ReactNode } from 'react';
import { useDeletePomodoro } from '@/store/pomodoro';
import { useNavigate } from 'react-router';
import useMatrixStore from '@/store/matrixStore';
import { TaskCard } from '@/components/eisenhower/card/TaskCard.tsx';

export default function DeletePomodoro({
  trigger,
  linkedUnlinkedPomodoro,
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

  const navigate = useNavigate();

  const deletePomodoro = useDeletePomodoro();
  const disconnectTaskFromPomodoro = useMatrixStore(
    (state) => state.disconnectTaskFromPomodoro,
  );

  const handleDeletePomodoro = () => {
    deletePomodoro(pomodoro.id);
    disconnectTaskFromPomodoro(eisenhower.id);
    navigate('/pomodoro');
  };

  return (
    <Modal
      trigger={trigger}
      title="뽀모도로를 삭제할까요?"
      description={`삭제 후 새로운 뽀모도로를 실행할 수 있어요`}
      footer={
        <div className="w-full flex justify-end">
          <div className="flex w-full justify-between gap-4">
            <DialogClose asChild>
              <Button size="sm" variant="white" className="px-8 flex-1">
                취소하기
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                size="sm"
                className="px-8 w-full flex-1"
                onClick={handleDeletePomodoro}
              >
                삭제하기
              </Button>
            </DialogClose>
          </div>
        </div>
      }
    >
      <>
        <div className="flex flex-col gap-[33px]">
          {eisenhower ? (
            <div className="rounded-[7px]">
              <TaskCard task={eisenhower} variant="inactive" layout="matrix" />
            </div>
          ) : (
            <div className="flex px-4 py-4 border border-[#E5E5E5] gap-2.5 rounded-[7px]">
              <Timer className="text-primary-100" />
              <p className="text-[16px] font-semibold">title</p>
            </div>
          )}

          {pomodoro.executedCycles.length > 0 ? (
            <div className="flex flex-col gap-[10px]">
              <div className=" bg-[#F2F2F2] rounded-[7px] px-[25px] py-[20px] h-[87px]">
                <MultiSlider
                  min={0}
                  max={totalExecutedTime}
                  step={1}
                  cycles={pomodoro.executedCycles}
                  readonly={true}
                />
              </div>
            </div>
          ) : null}
        </div>
      </>
    </Modal>
  );
}
