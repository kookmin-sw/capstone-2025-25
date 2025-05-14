import { ReactNode, useEffect, useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@radix-ui/react-dialog';
import { CalendarX2, Folder, Loader2, Tag } from 'lucide-react';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker';
import { BadgeSelector } from '@/components/common/BadgeSelector';
import { TaskCard } from '@/components/eisenhower/card/TaskCard';
import { quadrantTitles } from '@/constants/section.tsx';
// import { useCategoryStore } from '@/store/useCategoryStore';
import type { Task } from '@/types/task';
import { Quadrant } from '@/types/commonTypes';
import { eisenhowerService } from '@/services/eisenhowerService';
import { eisenhowerCategoryService } from '@/services/eisenhowerCategoryService';
import { useCategoryStore } from '@/store/useCategoryStore.ts';
import { toast } from 'sonner';
import PlusIcon from '@/assets/eisenhower/plus.svg';
import { BG_COLORS } from '@/types/category.ts';
import { showToast } from '@/components/common/Toast.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog.tsx';

type TaskModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  isOpen,
  onOpenChange,
  mode,
  task,
  currentTasksInQuadrant = [],
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [memo, setMemo] = useState(task?.memo || '');
  const [dueDate, setDueDate] = useState<string | null>(task?.dueDate ?? null);
  const [categoryId, setCategoryId] = useState<number | null>(
    task?.categoryId ?? null,
  );


  useEffect(() => {
    setTitle(task?.title || '');
    setMemo(task?.memo || '');
    setDueDate(task?.dueDate ?? null);
    setCategoryId(task?.categoryId ?? null);
  }, [task]);
  const [isEditing, setIsEditing] = useState(false);

  const closeHandler = () => {
    setIsEditing(false);
    onOpenChange()
  }

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
        dueDate: dueDate,
        categoryId: categoryId,
        quadrant: task?.quadrant,
        order: nextOrder,
      };
      const created = await eisenhowerService.create(payload);

      if (created?.content) {
        console.log(created.content);
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
          dueDate: dueDate,
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
    console.log('delete', task)
    if (task) {
      try {
        console.log(task)
        await eisenhowerService.delete(task.id);
        onDeleteTask?.(task);
        // toast.success('할 일이 삭제되었습니다.');
        showToast('success', '할 일이 삭제되었습니다.');
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
      const bgColor = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];

      await eisenhowerCategoryService.create({
        title: trimmed,
        color: bgColor,
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

  // const defaultTrigger =
  //   mode === 'create' ? (
  //     <button
  //       type="button"
  //       className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-blue shrink-0 cursor-pointer"
  //     >
  //       {/*<Plus className="w-5 h-5" />*/}
  //       <img src={PlusIcon} alt="plus" />
  //     </button>
  //   ) : task ? (
  //     <TaskCard
  //       key={String(task.id)}
  //       task={task}
  //       onClick={() => {}}
  //       layout="matrix"
  //       categories={categories}
  //     />
  //   ) : null;

  // const finalTrigger = trigger ?? defaultTrigger;

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
    <Dialog open={isOpen} onOpenChange={closeHandler}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <div className="flex gap-2 items-center">
              <div className="w-[26px] h-[26px] flex items-center justify-center rounded-[8px] text-sm font-semibold leading-none bg-blue text-neon-green shrink-0">
                {task?.quadrant?.replace('Q', '')}
              </div>
              <div className="text-[20px]">
                {quadrantTitles[task?.quadrant]}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            {/* "{item.title}" 버블을 저장할 보관함 폴더를 선택해주세요.*/}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="">
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
                      bgColor={opt?.bgColor ?? '#E8EFFF'}
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
            <div className="h-[80px] px-3 py-2 bg-[#F0F0F5] rounded-[8px]">
              <textarea
                className="resize-none w-full h-full  text-sm placeholder:text-gray-400 focus:outline-none"
                placeholder="일정에 관한 메모를 입력하세요."
                value={memo ?? ''}
                onChange={(e) => setMemo(e.target.value)}
                disabled={mode === 'edit' && !isEditing}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          {mode === 'create' ? (
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
                <Button onClick={handleDelete} variant="outline">
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
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>

    // <Modal
    //   trigger={finalTrigger}
    //   children={
    //     <div className="p-1">
    //       <div className="flex gap-2">
    //         <div className="w-6 h-6 flex items-center justify-center rounded-[8px] text-sm font-semibold leading-none bg-blue text-neon-green shrink-0">
    //           {quadrant.replace('Q', '')}
    //         </div>
    //         <div className="pb-2 text-[18px]">{quadrantTitles[quadrant]}</div>
    //       </div>
    //
    //       <div className="pb-2">
    //         <input
    //           className="text-3xl font-bold w-full border-transparent outline-none placeholder:text-[#CECFCD]"
    //           value={title}
    //           onChange={(e) => setTitle(e.target.value)}
    //           placeholder="새로운 일정"
    //           disabled={mode === 'edit' && !isEditing}
    //         />
    //       </div>
    //
    //       <div className="flex items-center gap-2 text-sm leading-none">
    //         <Tag className="w-4 h-4" />
    //         <span className="pt-1">카테고리</span>
    //         <div className="pt-1">
    //           {isEditing || mode === 'create' ? (
    //             <BadgeSelector
    //               options={categories.map((cat) => ({
    //                 label: cat.title,
    //                 value: String(cat.id),
    //                 bgColor: cat.color,
    //                 // textColor: cat.textColor,
    //               }))}
    //               selected={categoryId ? String(categoryId) : ''}
    //               onChange={(val) => setCategoryId(val ? Number(val) : null)}
    //               onCreateOption={handleAddCategory}
    //               onDeleteOption={handleDeleteCategory}
    //               renderBadge={(opt) => (
    //                 <CategoryBadge
    //                   label={opt.label}
    //                   bgColor={opt?.bgColor ?? '#E8EFFF'}
    //                   textColor={opt.textColor}
    //                 />
    //               )}
    //               label="카테고리"
    //               withSearch
    //               displayMode="block"
    //             />
    //           ) : categoryId ? (
    //             <CategoryBadge
    //               label={
    //                 categories.find((c) => c.id === categoryId)?.title ?? ''
    //               }
    //               bgColor={
    //                 categories.find((c) => c.id === categoryId)?.color ?? '#ccc'
    //               }
    //             />
    //           ) : (
    //             <span className="text-sm text-gray-400">카테고리 없음</span>
    //           )}
    //         </div>
    //       </div>
    //
    //       <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 pb-1">
    //         <div className="flex items-center gap-2 text-sm whitespace-nowrap leading-none">
    //           {/*<img src={CalendarOutlineIcon} alt="calendar" />*/}
    //           <CalendarX2 className="h-4 w-4" />
    //           <span className="pt-1">마감일</span>
    //           <div className="pt-1">
    //             <SingleDatePicker
    //               date={dueDate ?? ''}
    //               onChange={(date) => setDueDate(date)}
    //               disabled={mode === 'edit' && !isEditing}
    //             />
    //           </div>
    //         </div>
    //       </div>
    //
    //       <div>
    //         <label className="text-sm block py-1">메모</label>
    //         <div className='h-[80px] px-3 py-2 bg-[#F0F0F5] rounded-[8px]'>
    //           <textarea
    //               className="resize-none w-full h-full  text-sm placeholder:text-gray-400 focus:outline-none"
    //               placeholder="일정에 관한 메모를 입력하세요."
    //               value={memo ?? ''}
    //               onChange={(e) => setMemo(e.target.value)}
    //               disabled={mode === 'edit' && !isEditing}
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   }
    //   footer={
    //     mode === 'create' ? (
    //       <div className="flex justify-end gap-2">
    //         <DialogClose asChild>
    //           <Button
    //             onClick={handleCreate}
    //             disabled={!title.trim()}
    //             variant={!title.trim() ? 'disabled' : 'blue'}
    //           >
    //             생성하기
    //           </Button>
    //         </DialogClose>
    //       </div>
    //     ) : isEditing ? (
    //       <div className="flex gap-2 justify-end">
    //         <DialogClose asChild>
    //           <Button
    //             onClick={handleDelete}
    //             variant='outline'
    //           >
    //             삭제하기
    //           </Button>
    //         </DialogClose>
    //         <div className="flex gap-2">
    //           <DialogClose asChild>
    //             <Button
    //               onClick={handleSave}
    //               disabled={!title.trim()}
    //               variant="blue"
    //             >
    //               저장하기
    //             </Button>
    //           </DialogClose>
    //         </div>
    //       </div>
    //     ) : (
    //       <div className="flex justify-end gap-2">
    //         <Button onClick={() => setIsEditing(true)} variant="blue">
    //           수정하기
    //         </Button>
    //       </div>
    //     )
    //   }
    // />
  );
}
