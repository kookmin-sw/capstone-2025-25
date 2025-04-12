import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/Sheet.tsx';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge';
import {
  CalendarIcon,
  ChevronLeft,
  Edit2,
  Plus,
  Save,
  Tag,
  X,
} from 'lucide-react';
import { useCategoryStore } from '@/store/useCategoryStore';
import { format } from 'date-fns';
import type { Task } from '@/types/task';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker';
import { SECTION_TITLES } from '@/constants/eisenhower';

interface TaskDetailSidebarProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export function TaskDetailSidebar({
  task,
  isOpen,
  onClose,
  onSave,
}: TaskDetailSidebarProps) {
  const { categories, addCategory, removeCategory } = useCategoryStore();
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
      setIsEditing(false);
    }
  }, [task]);

  if (!task || !editedTask) return null;

  const handleSave = () => {
    onSave(editedTask);
    setIsEditing(false);
    onClose();
  };

  const handleCancelEdit = () => {
    setEditedTask({ ...task });
    setIsEditing(false);
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      addCategory(trimmed);
      setNewCategory('');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-[480px] h-screen p-0 overflow-y-auto"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <button
            onClick={isEditing ? handleCancelEdit : onClose}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ChevronLeft />
          </button>
          <SheetTitle className="text-base font-semibold">
            {isEditing ? '작업 편집' : '작업 상세'}
          </SheetTitle>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="p-2 rounded hover:bg-gray-100"
          >
            {isEditing ? (
              <Save className="w-5 h-5 text-purple-600" />
            ) : (
              <Edit2 className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-500 mb-1">
            {task.section && SECTION_TITLES[task.section]}
          </p>

          {isEditing ? (
            <input
              className="text-3xl font-bold w-full border-b py-1"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
            />
          ) : (
            <h1 className="text-3xl font-bold">{task.title}</h1>
          )}

          {/* 타입 */}
          <div className="flex items-center gap-3">
            <span className="text-sm">타입</span>
            {isEditing ? (
              <select
                value={editedTask.tags.type}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    tags: {
                      ...editedTask.tags,
                      type: e.target.value as Task['tags']['type'],
                    },
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="TODO">TODO</option>
                <option value="THINKING">THINKING</option>
              </select>
            ) : (
              <TypeBadge type={task.tags.type} />
            )}
          </div>

          {/* 카테고리 */}
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-purple-500" />
            <span className="text-sm">카테고리</span>
            {isEditing ? (
              <select
                value={editedTask.tags.category || ''}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    tags: { ...editedTask.tags, category: e.target.value },
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">없음</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              task.tags.category && (
                <CategoryBadge
                  label={task.tags.category}
                  colorClass="bg-yellow-100 text-yellow-600"
                />
              )
            )}
          </div>

          {/* 마감일 */}
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-purple-500" />
            <span className="text-sm">마감일</span>
            {isEditing ? (
              <SingleDatePicker
                date={new Date(editedTask.date || new Date())}
                onChange={(date) => setEditedTask({ ...editedTask, date })}
              />
            ) : (
              <span className="text-sm">
                {task.date ? format(new Date(task.date), 'yyyy.MM.dd') : '없음'}
              </span>
            )}
          </div>

          {/* 메모 */}
          <div>
            <p className="text-sm text-gray-600 mb-1">메모</p>
            {isEditing ? (
              <textarea
                value={editedTask.memo}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, memo: e.target.value })
                }
                className="w-full h-32 border rounded px-3 py-2 text-sm"
              />
            ) : (
              <p className="text-sm">{task.memo || '메모 없음'}</p>
            )}
          </div>

          {/* 카테고리 추가/삭제 */}
          {isEditing && (
            <div>
              <div className="flex gap-2 mt-2">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  placeholder="새 카테고리"
                  className="border px-2 py-1 text-sm rounded w-full"
                />
                <button
                  onClick={handleAddCategory}
                  className="bg-purple-100 text-purple-600 px-2 rounded hover:bg-purple-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between px-2 py-1 border rounded"
                  >
                    <span className="text-sm">{cat}</span>
                    <button onClick={() => removeCategory(cat)}>
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        {isEditing && (
          <div className="p-4 border-t flex gap-2">
            <button
              onClick={handleCancelEdit}
              className="flex-1 border rounded py-2"
            >
              취소하기
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-black text-white rounded py-2"
            >
              저장하기
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
