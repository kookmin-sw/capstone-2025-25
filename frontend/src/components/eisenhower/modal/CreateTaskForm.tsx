import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import type { Task, TaskType } from '@/types/task';

interface CreateTaskFormProps {
  sectionId: string;
  form: Omit<Task, 'id'>;
  setForm: (partial: Partial<Omit<Task, 'id'>>) => void; // 부분 객체 업데이트용 콜백 함수 (TaskForm 생성에서 id 제외하고 setting)
  onCreateTask: (taskData: Omit<Task, 'id'>) => void;
  categoryOptions: string[];
}

export function CreateTaskForm({
  sectionId,
  form,
  setForm,
  onCreateTask,
  categoryOptions,
}: CreateTaskFormProps) {
  const typeRef = useRef(null);
  const categoryRef = useRef(null);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useOutsideClick(typeRef, () => setIsTypeOpen(false));
  useOutsideClick(categoryRef, () => setIsCategoryOpen(false));

  return (
    <div>
      <div className="mb-4">
        <input
          value={form.title}
          onChange={(e) => setForm({ title: e.target.value })}
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
            <TypeBadge type={form.tags.type} />
            <ChevronDown className="w-4 h-4" />
          </button>
          {isTypeOpen && (
            <div className="absolute ml-12 top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 max-h-80 overflow-y-auto">
              {(['TODO', 'THINKING'] as TaskType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setForm({ tags: { ...form.tags, type } });
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
              label={form.tags.category || '선택하기'}
              colorClass="bg-gray-100 text-gray-500"
            />
            <ChevronDown className="w-4 h-4" />
          </button>
          {isCategoryOpen && (
            <div className="absolute ml-12 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 max-h-80 overflow-y-auto">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setForm({ tags: { ...form.tags, category: cat } });
                    setIsCategoryOpen(false);
                  }}
                  className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-sm"
                >
                  <CategoryBadge
                    label={cat}
                    colorClass="bg-yellow-100 text-yellow-600"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center">
          <span className="text-sm mr-4">마감일</span>
          <SingleDatePicker date={new Date()} />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm mb-2">메모</p>
        <textarea
          value={form.memo}
          onChange={(e) => setForm({ memo: e.target.value })}
          placeholder="일정에 관한 메모를 입력하세요."
          className="w-full h-24 p-3 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>
    </div>
  );
}
