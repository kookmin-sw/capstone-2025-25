import { useEffect, useMemo, useState } from 'react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/Sheet';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge';
import {
  CalendarIcon,
  ChevronsLeft,
  CircleDashed,
  PencilLine,
  Plus,
  Tag,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Task, TaskDetail } from '@/types/task';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker';
import { SECTION_TITLES } from '@/constants/eisenhower';
import type { Category } from '@/types/category';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router';
import { useCreateLinkedMindMap } from '@/store/mindmapListStore';
import useMatrixStore from '@/store/matrixStore';
import { usePomodoros } from '@/store/pomodoro';
import AddPomodoro from '@/components/ui/Modal/AddPomodoro';

interface TaskDetailSidebarProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
}

function convertToTaskDetail(task: Task): TaskDetail {
  return {
    ...task,
    isCompleted: false,
    createdAt: '',
    mindMapId: null,
    pomodoroId: null,
  };
}

export function TaskDetailSidebar({
  categories,
  onAddCategory,
  onDeleteCategory,
}: TaskDetailSidebarProps) {
  const [editedTask, setEditedTask] = useState<TaskDetail | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const createLinkedMindMap = useCreateLinkedMindMap();

  const activeTaskId = useMatrixStore((state) => state.activeTaskId);
  const setActiveTaskId = useMatrixStore((state) => state.setActiveTaskId);
  const getActiveTask = useMatrixStore((state) => state.getActiveTask);
  const saveTask = useMatrixStore((state) => state.saveTask);
  const deleteTask = useMatrixStore((state) => state.deleteTask);

  const createPomodoro = usePomodoros((state) => state.createPomodoro);

  const task = useMemo(() => {
    const activeTask = getActiveTask();
    return activeTaskId && activeTask ? convertToTaskDetail(activeTask) : null;
  }, [activeTaskId, getActiveTask]);

  const isOpen = activeTaskId !== null;

  const handleClose = () => {
    setActiveTaskId(null);
  };

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
      setIsEditing(false);
    }
  }, [task]);

  const handleSave = () => {
    if (editedTask) {
      saveTask(editedTask);
    }
  };

  const handleCancelEdit = () => {
    if (task) {
      setEditedTask({ ...task });
      setIsEditing(false);
    }
  };

  const handleDeleteTask = () => {
    if (task) {
      deleteTask(task.id);
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.some((cat) => cat.name === trimmed)) {
      onAddCategory(trimmed);
      setNewCategory('');
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === task?.categoryId,
  );

  const handleCreateMindmap = () => {
    if (!task) return;

    const newMindmapId = createLinkedMindMap(task);
    navigate(`/mindmap/${newMindmapId}`);
  };

  if (!task || !editedTask) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-[480px] h-screen p-0 overflow-y-auto"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <button
            onClick={isEditing ? handleCancelEdit : handleClose}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ChevronsLeft />
          </button>
          <SheetTitle className="text-base font-semibold">
            {isEditing ? '작업 편집' : '작업 상세'}
          </SheetTitle>
          {isEditing ? (
            <div className="p-2"></div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <PencilLine className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col p-6 h-full gap-6">
          <p className="text-sm text-gray-500 mb-1">
            {SECTION_TITLES[task.quadrant]}
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

          <div className="flex items-center gap-3">
            <CircleDashed className="w-4 h-4" />
            <span className="text-sm">타입</span>
            {isEditing ? (
              <select
                value={editedTask.type}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    type: e.target.value as TaskDetail['type'],
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="TODO">TODO</option>
                <option value="THINKING">THINKING</option>
              </select>
            ) : (
              <TypeBadge type={task.type} />
            )}
          </div>

          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4" />
            <span className="text-sm">카테고리</span>
            {isEditing ? (
              <select
                value={editedTask.categoryId ?? ''}
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask,
                    categoryId: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">없음</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            ) : (
              selectedCategory && (
                <CategoryBadge
                  label={selectedCategory.name}
                  colorClass="bg-yellow-100 text-yellow-600"
                />
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm">마감일</span>
            {isEditing ? (
              <SingleDatePicker
                date={editedTask.dueDate ?? null}
                onChange={(date) =>
                  setEditedTask({
                    ...editedTask,
                    dueDate: date,
                  })
                }
              />
            ) : (
              <span className="text-sm">
                {task.dueDate
                  ? format(new Date(task.dueDate), 'yyyy.MM.dd')
                  : '없음'}
              </span>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1 ">메모</p>
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
        </div>

        {isEditing && (
          <div className="p-4 border-t">
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
                  key={cat.id}
                  className="flex items-center justify-between px-2 py-1 border rounded"
                >
                  <span className="text-sm">{cat.name}</span>
                  <button onClick={() => onDeleteCategory(cat.name)}>
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="p-4 border-t flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleDeleteTask}
                className="flex-1 border rounded py-2"
              >
                삭제하기
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                className="flex-1 bg-black text-white rounded py-2"
              >
                저장하기
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCreateMindmap}
                className="flex-1 border rounded py-2"
              >
                마인드맵 그리기
              </Button>
              <AddPomodoro
                trigger={
                  <Button
                    variant="primary"
                    className="flex-1 bg-black text-white rounded py-2"
                  >
                    뽀모도로 실행하기
                  </Button>
                }
                linkedEisenhower={task}
              />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
