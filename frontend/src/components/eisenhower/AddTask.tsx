import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { CircleDashed, Tag, Calendar, Plus } from 'lucide-react';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker';
import { BadgeSelector } from '@/components/common/BadgeSelector';
import type { ActualTaskType, Quadrant, Task } from '@/types/task';
import { quadrantTitles } from '@/constants/section';
import { useCategoryStore } from '@/store/useCategoryStore';

type AddTaskProps = {
  quadrant: Quadrant;
  onCreateTask: (task: Task) => void;
  categoryOptions?: {
    bgColor: string;
    id: number;
    title: string;
    textColor: string | undefined;
  }[];
};

export function AddTask({
  quadrant,
  onCreateTask,
  // categoryOptions,
}: AddTaskProps) {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(
    new Date().toISOString().split('T')[0],
  );
  const [type, setType] = useState<ActualTaskType>('TODO');
  const [category_id, setCategoryId] = useState<number | null>(null);

  const { categories, addCategory, removeCategory } = useCategoryStore();

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

  const handleAddCategory = (title: string) => {
    const trimmed = title.trim();
    const alreadyExists = categories.some((cat) => cat.title === trimmed);
    if (!trimmed || alreadyExists) return;

    addCategory(trimmed);

    // 방금 추가한 카테고리 선택
    setTimeout(() => {
      const added = useCategoryStore
        .getState()
        .categories.find((c) => c.title === trimmed);
      if (added) setCategoryId(added.id);
    }, 0);
  };

  const handleDeleteCategory = (value: string) => {
    const id = Number(value);

    // 삭제 실행
    removeCategory(id);

    const current = useCategoryStore
      .getState()
      .categories.find((c) => c.id === id);
    if (!current && category_id === id) {
      setCategoryId(null);
    }
  };

  const typeOptions = [
    { label: 'TODO', value: 'TODO' },
    { label: 'THINKING', value: 'THINKING' },
  ];

  return (
    <Modal
      trigger={
        <button className="cursor-pointer">
          <Plus />
        </button>
      }
      children={
        <div className="p-1">
          <div className="mb-1 text-[18px]">{quadrantTitles[quadrant]}</div>

          {/* 제목 */}
          <div>
            <input
              className="text-3xl font-bold w-full border-transparent outline-none placeholder:text-[#CECFCD]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="새로운 일정"
            />
          </div>

          <div className="py-2 flex flex-col gap-2">
            {/* 타입 선택 */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm">
                <CircleDashed className="w-4 h-4" />
                타입
              </span>
              <div className="min-w-[100px]">
                <BadgeSelector
                  options={typeOptions}
                  selected={type}
                  onChange={(val) => setType(val as ActualTaskType)}
                  renderBadge={(option) => (
                    <TypeBadge type={option.value as ActualTaskType} />
                  )}
                  displayMode="block"
                />
              </div>
            </div>

            {/* 카테고리 선택 */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4" />
                카테고리
              </span>
              <div className="min-w-[100px]">
                <BadgeSelector
                  options={categories.map((cat) => ({
                    label: cat.title,
                    value: String(cat.id),
                    bgColor: cat.color,
                    textColor: cat.textColor,
                  }))}
                  selected={category_id ? String(category_id) : ''}
                  onChange={(val) => setCategoryId(val ? Number(val) : null)}
                  onCreateOption={handleAddCategory}
                  onDeleteOption={handleDeleteCategory}
                  renderBadge={(opt) => (
                    <CategoryBadge
                      label={opt.label}
                      bgColor={opt.bgColor}
                      textColor={opt.textColor}
                    />
                  )}
                  label="카테고리"
                  withSearch
                  displayMode="block"
                />
              </div>
            </div>

            {/* 마감일 */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm whitespace-nowrap">
                <Calendar className="w-4 h-4" />
                마감일
              </span>
              <SingleDatePicker
                date={dueDate}
                onChange={(date) => setDueDate(date)}
              />
            </div>
          </div>

          {/* 메모 입력 */}
          <div>
            <label className="text-sm block mb-1">메모</label>
            <textarea
              className="w-full min-h-[100px] border border-gray-300 rounded-[7px] px-3 py-2 text-sm placeholder:text-gray-400"
              placeholder="일정에 관한 메모를 입력하세요."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end gap-2">
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
    ></Modal>
  );
}
