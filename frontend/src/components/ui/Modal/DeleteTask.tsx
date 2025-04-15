import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import type { Task } from '@/types/task';
import { ReactNode } from 'react';
import { TaskCard } from '@/components/eisenhower/card/TaskCard.tsx';

type DeleteTaskModalProps = {
  trigger: ReactNode;
  task: Task;
  onDelete: (taskId: string | number) => void;
};

export default function DeleteTaskModal({
  trigger,
  task,
  onDelete,
}: DeleteTaskModalProps) {
  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <Modal
      trigger={trigger}
      title="이 일정을 삭제할까요?"
      description="연결된 마인드맵과 뽀모도로도 함께 삭제돼요"
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
                className="px-8 flex-1 bg-red-600 text-white"
                onClick={handleDelete}
              >
                삭제하기
              </Button>
            </DialogClose>
          </div>
        </div>
      }
    >
      <div className="flex  items-center">
        <TaskCard
          key={String(task.id)}
          task={{ ...task, id: task.id }}
          variant="done"
        />
      </div>
    </Modal>
  );
}
