import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { Tag, Calendar, Plus } from 'lucide-react';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker';
import { BadgeSelector } from '@/components/common/BadgeSelector';
import type { Task } from '@/types/task';
import { quadrantTitles } from '@/constants/section';
import { useCategoryStore } from '@/store/useCategoryStore';
import { Quadrant } from '@/types/commonTypes';
import { generateNumericId } from '@/lib/generateNumericId';

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
  const [category_id, setCategoryId] = useState<number | null>(null);

  const { categories, addCategory, removeCategory } = useCategoryStore();

  const resetForm = () => {
    setTitle('');
    setMemo('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setCategoryId(null);
  };

  const handleCreateTask = () => {
    const newTask: Task = {
      id: generateNumericId(),
      title,
      memo,
      dueDate: dueDate ?? '',
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
          <div className="pb-1">
            <input
              className="text-3xl font-bold w-full border-transparent outline-none placeholder:text-[#CECFCD]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="새로운 일정"
            />
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 pb-1">
            {/* 카테고리 */}
            <div className="flex items-center gap-2 text-sm leading-none">
              <Tag className="w-4 h-4" />
              <span className="pt-1">카테고리</span>
            </div>
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

            {/* 마감일 */}
            <div className="flex items-center gap-2 text-sm whitespace-nowrap leading-none ">
              <Calendar className="w-4 h-4" />
              <span className="pt-1">마감일</span>
            </div>
            <SingleDatePicker
              date={dueDate}
              onChange={(date) => setDueDate(date)}
            />
          </div>

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
