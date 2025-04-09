import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { CategoryBadge } from '@/components/PriorityMatrix/filter/CategoryBadge';
import { TypeBadge } from '@/components/PriorityMatrix/filter/TypeBadge';
import type { Task, TaskType } from '@/types/task';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  sectionId: string;
  onCreateTask: (task: Omit<Task, 'id'>) => void;
}

const CATEGORY_COLOR_PALETTE = [
  'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600',
  'bg-orange-100 text-orange-600',
  'bg-amber-100 text-amber-600',
  'bg-blue-100 text-blue-600',
  'bg-gray-100 text-gray-600',
];

export function CreateTaskModal({
  isOpen,
  onClose,
  sectionTitle,
  sectionId,
  onCreateTask,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('Todo');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [memo, setMemo] = useState('');

  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const typeRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setIsTypeOpen(false);
      }
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newTask: Omit<Task, 'id'> = {
      title,
      memo,
      date: dueDate,
      tags: {
        type: taskType,
        category: category || undefined,
      },
      section: sectionId,
    };

    onCreateTask(newTask);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setTaskType('Todo');
    setCategory('');
    setDueDate('');
    setMemo('');
  };

  const isFormValid = title.trim() !== '';

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          resetForm();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-500">{sectionTitle}</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="새로운 일정"
              className="text-2xl font-bold border-none p-0 h-auto focus:ring-0 placeholder-gray-300 outline-none w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="relative flex items-center gap-2" ref={typeRef}>
              <span className="text-sm">타입</span>
              <button
                className="flex items-center gap-1"
                onClick={() => setIsTypeOpen((prev) => !prev)}
              >
                <TypeBadge type={taskType} />
                <ChevronDown className="w-4 h-4" />
              </button>
              {isTypeOpen && (
                <div className="absolute ml-12 top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 max-h-80 overflow-y-auto">
                  {(['Todo', 'Thinking'] as TaskType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setTaskType(type);
                        setIsTypeOpen(false);
                      }}
                      className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm"
                    >
                      <TypeBadge type={type} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex items-center gap-2" ref={categoryRef}>
              <span className="text-sm">카테고리</span>
              <button
                className="flex items-center gap-1"
                onClick={() => setIsCategoryOpen((prev) => !prev)}
              >
                <CategoryBadge
                  label={category || '선택하기'}
                  colorClass="bg-gray-100 text-gray-500"
                />
                <ChevronDown className="w-4 h-4" />
              </button>
              {isCategoryOpen && (
                <div className="absolute ml-12 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 max-h-80 overflow-y-auto">
                  {['study', 'work', 'personal', 'oo'].map((cat, idx) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setIsCategoryOpen(false);
                      }}
                      className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm"
                    >
                      <CategoryBadge
                        label={cat}
                        colorClass={
                          CATEGORY_COLOR_PALETTE[
                            idx % CATEGORY_COLOR_PALETTE.length
                          ]
                        }
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-[#8d5cf6] mr-3" />
              <span className="text-sm mr-4">마감일</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs px-2 py-1 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#8d5cf6]"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm mb-2">메모</p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="일정에 관한 메모를 입력하세요."
              className="w-full h-24 p-3 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50"
            >
              취소하기
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isFormValid
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              생성하기
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
