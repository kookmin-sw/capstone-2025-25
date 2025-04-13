import type { ActualTaskType, Quadrant } from '@/types/task.ts';
import type { Category } from '@/types/category.ts';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge.tsx';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge.tsx';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker.tsx';
import { Calendar, RefreshCcw, Tag } from 'lucide-react';
import { SECTION_TITLES } from '@/constants/eisenhower.ts';

type CreateTaskFormProps = {
  form: {
    title: string;
    memo: string;
    dueDate: Date;
    type: ActualTaskType;
    categoryId: number | null;
    order: number;
    quadrant: Quadrant;
  };
  setForm: (partial: Partial<CreateTaskFormProps['form']>) => void;
  onCreateTask: (taskData: CreateTaskFormProps['form']) => void;
  categoryOptions: Category[];
};

export function CreateTaskForm({
  form,
  setForm,
  categoryOptions,
}: CreateTaskFormProps) {
  const selectedCategory = categoryOptions.find(
    (cat) => cat.id === form.categoryId,
  );

  return (
    <div className="space-y-6 p-6">
      {/* 상단 제목 */}
      <div>
        <p className="text-sm text-gray-500 mb-1">
          {SECTION_TITLES[form.quadrant]}
        </p>
        <input
          className="text-3xl font-bold w-full border-b border-transparent focus:border-gray-300 outline-none"
          value={form.title}
          onChange={(e) => setForm({ title: e.target.value })}
          placeholder="일정 제목을 입력하세요"
        />
      </div>

      {/* 타입, 카테고리, 마감일 */}
      <div className="space-y-3">
        {/* 타입 */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <RefreshCcw className="w-4 h-4" />
            타입
          </span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={form.type}
            onChange={(e) =>
              setForm({ type: e.target.value as ActualTaskType })
            }
          >
            <option value="TODO">TODO</option>
            <option value="THINKING">THINKING</option>
          </select>
          <TypeBadge type={form.type} />
        </div>

        {/* 카테고리 */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Tag className="w-4 h-4" />
            카테고리
          </span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={form.categoryId ?? ''}
            onChange={(e) =>
              setForm({ categoryId: Number(e.target.value) || null })
            }
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
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            마감일
          </span>
          <SingleDatePicker
            date={form.dueDate}
            onChange={(date) => setForm({ dueDate: date })}
          />
        </div>
      </div>

      {/* 메모 */}
      <div>
        <label className="text-sm block mb-1">메모</label>
        <textarea
          className="w-full min-h-[120px] border rounded px-3 py-2 text-sm placeholder:text-gray-400"
          placeholder="일정에 관한 메모를 입력하세요."
          value={form.memo}
          onChange={(e) => setForm({ memo: e.target.value })}
        />
      </div>
    </div>
  );
}
