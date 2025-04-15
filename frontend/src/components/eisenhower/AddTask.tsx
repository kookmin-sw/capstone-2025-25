import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { CircleDashed, Tag, Calendar, Plus } from 'lucide-react';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge.tsx';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge.tsx';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker.tsx';
import type { ActualTaskType, Quadrant, Task } from '@/types/task.ts';
import type { Category } from '@/types/category.ts';
import { quadrantTitles } from '@/constants/section';

type AddTaskProps = {
  quadrant: Quadrant;
  categoryOptions: Category[];
  onCreateTask: (task: Task) => void;
};

export function AddTask({
  quadrant,
  categoryOptions,
  onCreateTask,
}: AddTaskProps) {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(
    new Date().toISOString().split('T')[0],
  );
  const [type, setType] = useState<ActualTaskType>('TODO');
  const [category_id, setCategoryId] = useState<number | null>(null);

  const selectedCategory = categoryOptions.find(
    (cat) => cat.id === category_id,
  );

  const resetForm = () => {
    setTitle('');
    setMemo('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setType('TODO');
    setCategoryId(null);
  };

  const handleCreateTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      memo,
      dueDate: dueDate ?? '',
      type,
      category_id,
      quadrant,
      order: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      mindMapId: null,
      pomodoroId: null,
    };

    onCreateTask(newTask);
    resetForm();
  };

  return (
    <Modal
      trigger={
        // Button 컴포넌트 사용 시 스타일링 깨짐
        <button className="cursor-pointer">
          <Plus />
        </button>
      }
      title="새로운 작업 추가"
      description={quadrantTitles[quadrant]}
      footer={
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">취소하기</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleCreateTask}
              disabled={!title.trim() || !dueDate}
            >
              생성하기
            </Button>
          </DialogClose>
        </div>
      }
    >
      <div className="p-1">
        {/* 상단 제목 */}
        <div>
          <input
            className="text-3xl font-bold w-full border-b border-transparent focus:border-gray-300 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일정 제목을 입력하세요"
          />
        </div>

        {/* 타입, 카테고리, 마감일 */}
        <div className="py-2 flex flex-col gap-2">
          {/* 타입 */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <CircleDashed className="w-4 h-4" />
              타입
            </span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value as ActualTaskType)}
            >
              <option value="TODO">TODO</option>
              <option value="THINKING">THINKING</option>
            </select>
            <TypeBadge type={type} />
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Tag className="w-4 h-4" />
              카테고리
            </span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={category_id ?? ''}
              onChange={(e) => setCategoryId(Number(e.target.value) || null)}
            >
              <option value="">선택 안 함</option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <CategoryBadge
                label={selectedCategory.name}
                colorClass="bg-yellow-100 text-yellow-600"
              />
            )}
          </div>

          {/* 마감일 */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-gray-500 whitespace-nowrap">
              <Calendar className="w-4 h-4" />
              마감일
            </span>
            <SingleDatePicker
              date={dueDate}
              onChange={(date) => setDueDate(date)}
            />
          </div>
        </div>

        {/* 메모 */}
        <div>
          <label className="text-sm block mb-1">메모</label>
          <textarea
            className="w-full min-h-[120px] border rounded px-3 py-2 text-sm placeholder:text-gray-400"
            placeholder="일정에 관한 메모를 입력하세요."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
