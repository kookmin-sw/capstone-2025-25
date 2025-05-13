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
import { Tag, CalendarX2 } from 'lucide-react';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker';
import { useNavigate } from 'react-router';
import useCreateMatrix from '@/hooks/queries/brainstorming/useCreateMatrix';

import q1Image from '@/assets/q1.svg';
import q2Image from '@/assets/q2.svg';
import q3Image from '@/assets/q3.svg';
import q4Image from '@/assets/q4.svg';
import { Quadrant } from '@/types/commonTypes';
import { BadgeSelector } from '@/components/common/BadgeSelector.tsx';
import { useCategoryStore } from '@/store/useCategoryStore.ts';
import { eisenhowerCategoryService } from '@/services/eisenhowerCategoryService.ts';
import type { Task } from '@/types/task.ts';

type NodeToTaskModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  taskData: {
    title: string;
    id: number | null;
  };
  task?: Task;
};

export function NodeToTaskModal({
  isOpen,
  onOpenChange,
  taskData,
  task,
}: NodeToTaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [dueDate, setDueDate] = useState<string | null>(
    new Date().toISOString().split('T')[0],
  );

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
  const navigate = useNavigate();

  const [priority, setPriority] = useState<Quadrant>('Q1');
  const [memo, setMemo] = useState<string>('');

  const { createMatrixMutation } = useCreateMatrix();

  const resetForm = () => {
    setTitle('');
    setMemo('');
    setDueDate('');
    setCategoryId(null);
  };

  const handleConfirmCreateTask = () => {
    if (!taskData.id || !dueDate) return;
    resetForm();
    createMatrixMutation(
      {
        bubbleId: taskData.id,
        payload: {
          title: taskData.title,
          categoryId: 3, // 일단 "기타" 고정
          dueDate,
          quadrant: priority,
          order: 1,
          memo,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false); // 모달 닫기
          navigate('/matrix'); // 페이지 이동
        },
        onError: (err) => {
          console.error('생성 실패:', err);
          alert('일정 생성에 실패했습니다.');
        },
      },
    );
  };

  const { categories, fetchCategories } = useCategoryStore();

  const [categoryId, setCategoryId] = useState<number | null>(
    task?.categoryId ?? null,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg gap-2">
        <DialogHeader>
          <DialogTitle>새로운 일정 추가</DialogTitle>
          <DialogDescription>
            선택한 노드를 바탕으로 생성된 일정을 매트릭스에 추가해보세요.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="pb-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={taskData.title}
              className="text-3xl font-bold w-full border-transparent outline-none placeholder:text-[#CECFCD]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm leading-none">
              <div className="flex items-center gap-1">
                <Tag size={15} />
                <label className="text-[14px] ">카테고리</label>
              </div>
              <div className="pt-1">
                <BadgeSelector
                  options={categories.map((cat) => ({
                    label: cat.title,
                    value: String(cat.id),
                    bgColor: cat.color,
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
              </div>
            </div>

            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 pb-1">
              <div className="flex items-center gap-2 text-sm whitespace-nowrap leading-none">
                <CalendarX2 size={15} />
                <label className="text-[14px]">마감일</label>
              </div>
              <SingleDatePicker
                date={dueDate}
                onChange={(date) => setDueDate(date)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <label className="text-[14px]">우선순위</label>
              </div>
              <div>
                <Tabs
                  defaultValue="Q1"
                  className="w-full"
                  onValueChange={(value) => setPriority(value as Quadrant)}
                >
                  <TabsList className="grid grid-cols-4 w-full h-12">
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
              <div className="flex items-center gap-1">
                <label className="text-[14px]">메모</label>
              </div>
              <div>
                <textarea
                  placeholder="일정에 관한 메모를 입력하세요"
                  className="w-full h-20 px-4 py-[14px]  rounded-[6px] focus:outline-none resize-none text-[14px] bg-[#F0F0F5]"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/*</div>*/}
        </div>

        <DialogFooter className="mt-6">
          <div className="w-[180px] flex justify-end">
            <DialogClose asChild>
              <Button
                size="sm"
                variant={!title.trim() ? 'disabled' : 'blue'}
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
