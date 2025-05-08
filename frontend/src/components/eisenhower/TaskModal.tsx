import { ReactNode, useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { Tag, Calendar, Plus } from 'lucide-react';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker';
import { BadgeSelector } from '@/components/common/BadgeSelector';
import { TaskCard } from '@/components/eisenhower/card/TaskCard';
import { quadrantTitles } from '@/constants/section';
import { useCategoryStore } from '@/store/useCategoryStore';
import type { Task } from '@/types/task';
import { Quadrant } from '@/types/commonTypes';
import { generateNumericId } from '@/lib/generateNumericId';

type TaskModalProps = {
  mode: 'create' | 'edit';
  quadrant: Quadrant;
  task?: Task;
  onCreateTask?: (task: Task) => void;
  onUpdateTask?: (task: Task) => void;
  onDeleteTask?: (id: number | string) => void;
  trigger?: ReactNode;
};

export function TaskModal({
  mode,
  quadrant,
  task,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  trigger,
}: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [memo, setMemo] = useState(task?.memo || '');
  const [dueDate, setDueDate] = useState<string | null>(
    task?.dueDate || new Date().toISOString().split('T')[0],
  );
  const [category_id, setCategoryId] = useState<number | null>(
    task?.category_id ?? null,
  );
  const [isEditing, setIsEditing] = useState(false);

  const { categories, addCategory, removeCategory } = useCategoryStore();

  const resetForm = () => {
    setTitle('');
    setMemo('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setCategoryId(null);
  };

  const handleCreate = () => {
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
    onCreateTask?.(newTask);
    resetForm();
  };

  const handleSave = () => {
    if (task && onUpdateTask) {
      const updatedTask = {
        ...task,
        title,
        memo,
        dueDate: dueDate ?? '',
        category_id,
      };
      onUpdateTask(updatedTask);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (task && onDeleteTask) {
      onDeleteTask(task.id);
    }
  };

  const handleAddCategory = (title: string) => {
    const trimmed = title.trim();
    const exists = categories.some((cat) => cat.title === trimmed);
    if (!trimmed || exists) return;

    addCategory(trimmed);
    setTimeout(() => {
      const added = useCategoryStore
        .getState()
        .categories.find((c) => c.title === trimmed);
      if (added) setCategoryId(added.id);
    }, 0);
  };

  const handleDeleteCategory = (value: string) => {
    const id = Number(value);
    removeCategory(id);
    const current = useCategoryStore
      .getState()
      .categories.find((c) => c.id === id);
    if (!current && category_id === id) setCategoryId(null);
  };

  const defaultTrigger =
    mode === 'create' ? (
      <button className="cursor-pointer">
        <Plus />
      </button>
    ) : task ? (
      <TaskCard
        key={String(task.id)}
        task={task}
        onClick={() => {}}
        layout="matrix"
      />
    ) : null;

  const finalTrigger = trigger ?? defaultTrigger;

  return (
    <Modal
      trigger={finalTrigger}
      children={
        <div className="p-1">
          <div className="pb-2 text-[18px]">{quadrantTitles[quadrant]}</div>
          <div className="pb-2">
            <input
              className="text-3xl font-bold w-full border-transparent outline-none placeholder:text-[#CECFCD]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="새로운 일정"
              disabled={mode === 'edit' && !isEditing}
            />
          </div>

          <div className="flex items-center gap-2 text-sm leading-none">
            <Tag className="w-4 h-4" />
            <span className="pt-1">카테고리</span>
            <div className="pt-1">
              {isEditing || mode === 'create' ? (
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
              ) : category_id ? (
                <CategoryBadge
                  label={
                    categories.find((c) => c.id === category_id)?.title ?? ''
                  }
                  bgColor={
                    categories.find((c) => c.id === category_id)?.color ??
                    '#ccc'
                  }
                  textColor={
                    categories.find((c) => c.id === category_id)?.textColor ??
                    '#000'
                  }
                />
              ) : (
                <span className="text-sm text-gray-400">카테고리 없음</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 pb-1">
            <div className="flex items-center gap-2 text-sm whitespace-nowrap leading-none">
              <Calendar className="w-4 h-4" />
              <span className="pt-1">마감일</span>
              <div className="pt-1">
                <SingleDatePicker
                  date={dueDate}
                  onChange={(date) => setDueDate(date)}
                  disabled={mode === 'edit' && !isEditing}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm block py-1">메모</label>
            <textarea
              className="w-full min-h-[100px] border border-gray-300 rounded-[7px] px-3 py-2 text-sm placeholder:text-gray-400"
              placeholder="일정에 관한 메모를 입력하세요."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              disabled={mode === 'edit' && !isEditing}
            />
          </div>
        </div>
      }
      footer={
        mode === 'create' ? (
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button
                onClick={handleCreate}
                disabled={!title.trim() || !dueDate}
              >
                생성하기
              </Button>
            </DialogClose>
          </div>
        ) : isEditing ? (
          <div className="flex justify-between gap-2">
            <Button variant="destructive" onClick={handleDelete}>
              삭제하기
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button
                  onClick={handleSave}
                  disabled={!title.trim() || !dueDate}
                >
                  저장하기
                </Button>
              </DialogClose>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsEditing(true)}>수정하기</Button>
          </div>
        )
      }
    />
  );
}
