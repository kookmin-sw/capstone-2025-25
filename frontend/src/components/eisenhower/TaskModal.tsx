import { ReactNode, useEffect, useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { CalendarX2, Tag } from 'lucide-react';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker';
import { BadgeSelector } from '@/components/common/BadgeSelector';
import { TaskCard } from '@/components/eisenhower/card/TaskCard';
import { quadrantTitles } from '@/constants/section';
// import { useCategoryStore } from '@/store/useCategoryStore';
import type { Task } from '@/types/task';
import { Quadrant } from '@/types/commonTypes';
import { eisenhowerService } from '@/services/eisenhowerService';
import { eisenhowerCategoryService } from '@/services/eisenhowerCategoryService';
import { useCategoryStore } from '@/store/useCategoryStore.ts';
import { toast } from 'sonner';
import PlusIcon from '@/assets/eisenhower/plus.svg';

type TaskModalProps = {
  mode: 'create' | 'edit';
  quadrant: Quadrant;
  task?: Task;
  currentTasksInQuadrant?: Task[];
  onCreateTask?: (task: Task) => void;
  onUpdateTask?: (task: Task) => void;
  onDeleteTask?: (id: number | string) => void;
  trigger?: ReactNode;
};

export function TaskModal({
  mode,
  quadrant,
  task,
  currentTasksInQuadrant = [],
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  trigger,
}: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [memo, setMemo] = useState(task?.memo || '');
  const [dueDate, setDueDate] = useState<string | null>(task?.dueDate ?? null);
  const [categoryId, setCategoryId] = useState<number | null>(
    task?.categoryId ?? null,
  );
  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
    setTitle('');
    setMemo('');
    setDueDate('');
    setCategoryId(null);
  };

  const handleCreate = async () => {
    try {
      const nextOrder = currentTasksInQuadrant.length + 1;
      const payload = {
        title,
        memo,
        dueDate,
        categoryId: categoryId,
        quadrant,
        order: nextOrder,
      };
      const created = await eisenhowerService.create(payload);

      if (created?.content) {
        onCreateTask?.(created.content);
      }

      resetForm();
    } catch (err) {
      console.error('생성 실패:', err);
    }
  };

  const handleSave = async () => {
    if (task) {
      try {
        const payload = {
          title,
          memo,
          dueDate,
          categoryId: categoryId,
          isCompleted: task.isCompleted,
          dueDateExplicitlyNull: dueDate === null,
          categoryExplicitlyNull: categoryId === null,
        };
        const updated = await eisenhowerService.update(task.id, payload);
        onUpdateTask?.({
          ...task,
          ...updated.content,
        });
        setIsEditing(false);
      } catch (err) {
        console.error('수정 실패:', err);
      }
    }
  };
  const handleDelete = async () => {
    if (task) {
      try {
        await eisenhowerService.delete(task.id);
        onDeleteTask?.(task.id);
        toast.success('할 일이 삭제되었습니다.');
      } catch (err) {
        console.error('삭제 실패:', err);
      }
    }
  };

  const { categories, fetchCategories } = useCategoryStore();

  const handleAddCategory = async (title: string) => {
    const trimmed = title.trim();
    const exists = categories.some((cat) => cat.title === trimmed);
    if (!trimmed || exists) return;

    try {
      await eisenhowerCategoryService.create({
        title: trimmed,
        color: '#E8EFFF',
      });
      await fetchCategories();
      const added = useCategoryStore
        .getState()
        .categories.find((c) => c.title === trimmed);

      if (added) {
        setCategoryId(added.id);
      } else {
        console.warn('새 카테고리 추가 후 찾을 수 없음');
      }
    } catch (err) {
      console.error('카테고리 생성 실패:', err);
    }
  };

  const handleDeleteCategory = async (value: string) => {
    const id = Number(value);
    try {
      await eisenhowerCategoryService.delete(id);
      await fetchCategories();
      if (!categories.find((c) => c.id === id) && categoryId === id) {
        setCategoryId(null);
      }
    } catch (err) {
      console.error('카테고리 삭제 실패:', err);
    }
  };

  const defaultTrigger =
    mode === 'create' ? (
      <button
        type="button"
        className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-blue shrink-0 cursor-pointer"
      >
        {/*<Plus className="w-5 h-5" />*/}
        <img src={PlusIcon} alt="plus" />
      </button>
    ) : task ? (
      <TaskCard
        key={String(task.id)}
        task={task}
        onClick={() => {}}
        layout="matrix"
        categories={categories}
      />
    ) : null;

  const finalTrigger = trigger ?? defaultTrigger;

  // useEffect(() => {
  //   const fetchTaskDetail = async () => {
  //     if (mode === 'edit' && task?.id) {
  //       try {
  //         const result = await eisenhowerService.getDetail(task.id);
  //         const detail = result.content;
  //         setTitle(detail.title);
  //         setMemo(detail.memo);
  //         setDueDate(detail.dueDate ?? '');
  //         setCategoryId(detail.categoryId ?? null);
  //       } catch (err) {
  //         console.error('단일 작업 조회 실패:', err);
  //       }
  //     }
  //   };
  //
  //   fetchTaskDetail();
  // }, [mode, task]);

  useEffect(() => {
    if (mode === 'edit' && task) {
      setTitle(task.title);
      setMemo(task.memo ?? '');
      setDueDate(task.dueDate ?? '');
      setCategoryId(task.categoryId ?? null);
    }
  }, [task, mode]);

  return (
    <Modal
      trigger={finalTrigger}
      children={
        <div className="p-1">
          <div className="flex gap-2">
            <div className="w-6 h-6 flex items-center justify-center rounded-[8px] text-sm font-semibold leading-none bg-blue text-neon-green shrink-0">
              {quadrant.replace('Q', '')}
            </div>
            <div className="pb-2 text-[18px]">{quadrantTitles[quadrant]}</div>
          </div>

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
                    // textColor: cat.textColor,
                  }))}
                  selected={categoryId ? String(categoryId) : ''}
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
              ) : categoryId ? (
                <CategoryBadge
                  label={
                    categories.find((c) => c.id === categoryId)?.title ?? ''
                  }
                  bgColor={
                    categories.find((c) => c.id === categoryId)?.color ?? '#ccc'
                  }
                />
              ) : (
                <span className="text-sm text-gray-400">카테고리 없음</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 pb-1">
            <div className="flex items-center gap-2 text-sm whitespace-nowrap leading-none">
              {/*<img src={CalendarOutlineIcon} alt="calendar" />*/}
              <CalendarX2 className="h-4 w-4" />
              <span className="pt-1">마감일</span>
              <div className="pt-1">
                <SingleDatePicker
                  date={dueDate ?? ''}
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
              value={memo ?? ''}
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
                disabled={!title.trim()}
                variant={!title.trim() ? 'disabled' : 'blue'}
              >
                생성하기
              </Button>
            </DialogClose>
          </div>
        ) : isEditing ? (
          <div className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button
                onClick={handleDelete}
                className="text-blue bg-[#E8EFFF] hover:bg-[#E8EFFF]"
              >
                삭제하기
              </Button>
            </DialogClose>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button
                  onClick={handleSave}
                  disabled={!title.trim()}
                  variant="blue"
                >
                  저장하기
                </Button>
              </DialogClose>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsEditing(true)} variant="blue">
              수정하기
            </Button>
          </div>
        )
      }
    />
  );
}
