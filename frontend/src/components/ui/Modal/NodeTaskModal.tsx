import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { CircleDashed, Tag, Calendar } from 'lucide-react';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker';
import { useNavigate } from 'react-router';
import useMatrixStore from '@/store/matrixStore';
import {
  useClearSelectedNodes,
  useToggleNodeSelectionMode,
} from '@/store/nodeSelection';

import q1Image from '@/assets/q1.svg';
import q2Image from '@/assets/q2.svg';
import q3Image from '@/assets/q3.svg';
import q4Image from '@/assets/q4.svg';
import { Quadrant } from '@/types/commonTypes';

type NodeToTaskModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  taskData: {
    title: string;
    id: number | null;
  };
};

export function NodeToTaskModal({
  isOpen,
  onOpenChange,
  taskData,
}: NodeToTaskModalProps) {
  const [dueDate, setDueDate] = useState<string | null>(
    new Date().toISOString().split('T')[0],
  );

  const navigate = useNavigate();

  const [priority, setPriority] = useState<Quadrant>('Q1');
  const [memo, setMemo] = useState<string>('');

  const { addTaskFromNode, setActiveTaskId } = useMatrixStore();
  const clearSelectedNodes = useClearSelectedNodes();
  const toggleNodeSelectionMode = useToggleNodeSelectionMode();

  const handleConfirmCreateTask = () => {
    if (taskData.id) {
      const newTask = addTaskFromNode(
        taskData.title,
        taskData.id,
        dueDate,
        memo,
        priority,
      );

      if (newTask) {
        setActiveTaskId(newTask.id);
        clearSelectedNodes();
        toggleNodeSelectionMode();

        navigate('/matrix');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>새로운 일정 추가</DialogTitle>
          <DialogDescription>
            선택한 노드를 바탕으로 생성된 일정을 매트릭스에 추가해보세요.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex flex-col gap-[33px] px-[25px] py-[30px] border border-gray-300 rounded-[7px]">
            <h3 className="text-[22px] font-semibold">{taskData.title}</h3>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-1 mb-3">
                <div className="w-24 flex items-center gap-1">
                  <CircleDashed size={15} />
                  <label className="text-[14px]">타입</label>
                </div>
                <TypeBadge type="TODO" />
              </div>

              <div className="flex items-center gap-1">
                <div className="w-24 flex items-center gap-1">
                  <Tag size={15} />
                  <label className="text-[14px]">카테고리</label>
                </div>
                <CategoryBadge label="기타" />
              </div>

              <div className="flex items-center gap-1">
                <div className="w-24 flex items-center gap-1">
                  <Calendar size={15} />
                  <label className="text-[14px]">마감일</label>
                </div>
                <SingleDatePicker
                  date={dueDate}
                  onChange={(date) => setDueDate(date)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-24 flex items-center gap-1">
                  <Calendar size={15} />
                  <label className="text-[14px]">우선순위</label>
                </div>
                <div>
                  <Tabs
                    defaultValue="Q1"
                    className="w-full"
                    onValueChange={(value) => setPriority(value as Quadrant)}
                  >
                    <TabsList className="grid grid-cols-4 w-full h-10">
                      <TabsTrigger value="Q1">
                        <img src={q1Image} alt="q1" className="w-6 h-6" />
                      </TabsTrigger>
                      <TabsTrigger value="Q2">
                        <img src={q2Image} alt="q1" className="w-6 h-6" />
                      </TabsTrigger>
                      <TabsTrigger value="Q3">
                        <img src={q3Image} alt="q3" className="w-6 h-6" />
                      </TabsTrigger>
                      <TabsTrigger value="Q4">
                        <img src={q4Image} alt="q4" className="w-6 h-6" />
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-24 flex items-center gap-1">
                  <label className="text-[14px]">메모</label>
                </div>
                <div>
                  <textarea
                    placeholder="일정에 관한 메모를 입력하세요"
                    className="w-full h-24 px-4 py-[14px] border border-gray-600 rounded-[6px] focus:outline-none resize-none text-[14px]"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <div className="w-[180px] flex justify-end">
            <DialogClose asChild>
              <Button
                size="sm"
                variant="black"
                className="flex-1"
                onClick={handleConfirmCreateTask}
              >
                생성하기
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
