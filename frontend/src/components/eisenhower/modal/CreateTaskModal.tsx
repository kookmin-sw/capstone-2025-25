import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { CreateTaskForm } from './CreateTaskForm';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/Dialog';
import type { Task } from '@/types/task';
import { SECTION_TITLES } from '@/constants/eisenhower';
import { useCategoryStore } from '@/store/useCategoryStore';

type CreateTaskModalProps = {
  isOpen: boolean;
  sectionId: string;
  onClose: () => void;
  onCreate: (task: Task) => void;
};

export function CreateTaskModal({
  isOpen,
  sectionId,
  onClose,
  onCreate,
}: CreateTaskModalProps) {
  const [form, setForm] = useState<Omit<Task, 'id'>>({
    title: '',
    memo: '',
    date: '',
    tags: { type: 'TODO', category: undefined },
    section: sectionId,
  });

  const { categories } = useCategoryStore();

  const resetForm = () =>
    setForm({
      title: '',
      memo: '',
      date: '',
      tags: { type: 'TODO', category: undefined },
      section: sectionId,
    });

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...form,
      section: sectionId,
    };
    onCreate(newTask);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="새로운 작업 추가"
      description={SECTION_TITLES[sectionId]}
      trigger={<></>}
      children={
        <CreateTaskForm
          sectionId={sectionId}
          form={form}
          setForm={setForm}
          onCreateTask={handleCreate}
          categoryOptions={categories}
        />
      }
      footer={
        <div className="flex justify-between w-full">
          <DialogClose asChild>
            <Button variant="white" onClick={onClose}>
              취소하기
            </Button>
          </DialogClose>
          <DialogClose>
            <Button onClick={handleCreate}>생성하기</Button>
          </DialogClose>
        </div>
      }
    />
  );
}
