import { useEffect, useMemo, useState } from 'react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/Sheet.tsx';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { CalendarIcon, ChevronsLeft, PencilLine, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { Task } from '@/types/task';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker';
import { SECTION_TITLES } from '@/constants/eisenhower';
import type { Category } from '@/types/category';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router';
import {
  useCreateLinkedMindMap,
  useDisconnectMindmapTask,
} from '@/store/mindmapListStore';
import useMatrixStore from '@/store/matrixStore';
import AddPomodoro from '@/components/ui/Modal/AddPomodoro';
import { useDisconnectPomodoroTask } from '@/store/pomodoro';
import DeleteTaskModal from '@/components/ui/Modal/DeleteTask';
import { BadgeSelector } from '@/components/common/BadgeSelector';

interface TaskDetailSidebarProps {
  categories: Category[];
}

export function TaskDetailSidebar({ categories }: TaskDetailSidebarProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const createLinkedMindMap = useCreateLinkedMindMap();

  const activeTaskId = useMatrixStore((state) => state.activeTaskId);
  const setActiveTaskId = useMatrixStore((state) => state.setActiveTaskId);
  const getActiveTask = useMatrixStore((state) => state.getActiveTask);
  const saveTask = useMatrixStore((state) => state.saveTask);
  const deleteTask = useMatrixStore((state) => state.deleteTask);
  const connectTaskToMindMap = useMatrixStore(
    (state) => state.connectTaskToMindMap,
  );

  const disconnectMindMapTask = useDisconnectMindmapTask();
  const disconnectPomodoroTask = useDisconnectPomodoroTask();

  const task = useMemo(() => {
    return getActiveTask();
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
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (task) {
      setEditedTask({ ...task });
      setIsEditing(false);
    }
  };

  const handleDeleteTask = () => {
    if (task) {
      const { mindMapId, pomodoroId } = deleteTask(task.id);

      if (mindMapId) {
        disconnectMindMapTask(mindMapId);
      }

      // 포모도로 연결 해제
      if (pomodoroId) {
        disconnectPomodoroTask(pomodoroId as number);
      }
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === task?.category_id,
  );

  const handleCreateMindmap = () => {
    if (!task) return;

    setActiveTaskId(null);

    if (task.mindMapId) {
      navigate(`/mindmap/${task.mindMapId}`);
      return;
    }

    const newMindmapId = createLinkedMindMap(task);
    connectTaskToMindMap(task.id, newMindmapId);
    navigate(`/mindmap/${newMindmapId}`);
  };

  const categoryOptions = categories.map((cat) => ({
    label: cat.title,
    value: String(cat.id),
    bgColor: cat.color,
    textColor: cat.textColor,
  }));

  if (!task || !editedTask) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-[480px] h-screen p-0 overflow-y-auto"
      >
        <div className="flex items-center justify-between px-4 py-3 ">
          <button
            onClick={isEditing ? handleCancelEdit : handleClose}
            className="p-2 rounded hover:bg-gray-100 cursor-pointer"
          >
            <ChevronsLeft />
          </button>
          <SheetTitle className="text-base font-semibold">
            {isEditing ? '일정 편집' : '일정 상세'}
          </SheetTitle>
          {isEditing ? (
            <div className="w-9 h-9"></div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <PencilLine className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col px-6 h-full gap-6">
          <div>
            <p className="text-sm text-gray-500 ">
              {SECTION_TITLES[task.quadrant]}
            </p>
            {isEditing ? (
              <input
                className="text-3xl font-bold w-full py-1"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
              />
            ) : (
              <h1 className="text-3xl font-bold py-1">{task.title}</h1>
            )}
          </div>

          <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4">
            {/* 카테고리 */}
            <div className="flex items-center gap-2 text-sm">
              <Tag className="w-4 h-4" />
              <span>카테고리</span>
            </div>
            {isEditing ? (
              <BadgeSelector
                options={categoryOptions}
                selected={String(editedTask.category_id ?? '')}
                onChange={(val) =>
                  setEditedTask({
                    ...editedTask,
                    category_id: val === '' ? null : Number(val),
                  })
                }
                renderBadge={(option) => (
                  <CategoryBadge
                    label={option.label}
                    bgColor={option.bgColor}
                    textColor={option.textColor}
                  />
                )}
                displayMode="block"
                withSearch={false}
              />
            ) : (
              selectedCategory && (
                <CategoryBadge
                  label={selectedCategory.title}
                  bgColor={selectedCategory.color}
                  textColor={selectedCategory.textColor}
                />
              )
            )}

            {/* 마감일 */}
            <div className="flex items-center gap-2 text-sm whitespace-nowrap">
              <CalendarIcon className="w-4 h-4" />
              <span className="pt-1">마감일</span>
            </div>
            {isEditing ? (
              <SingleDatePicker
                date={editedTask.dueDate ?? null}
                onChange={(date) =>
                  setEditedTask({
                    ...editedTask,
                    dueDate: date ?? '',
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

        <div className="p-4 flex gap-2">
          {isEditing ? (
            <>
              <DeleteTaskModal
                task={task}
                onDelete={handleDeleteTask}
                trigger={
                  <Button
                    variant="outline"
                    className="flex-1 border rounded py-2"
                  >
                    삭제하기
                  </Button>
                }
              />
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
                {task.mindMapId ? '마인드맵 이동하기' : '마인드맵 그리기'}
              </Button>

              {task.pomodoroId ? (
                <Button
                  variant="primary"
                  className="flex-1 bg-black text-white rounded py-2"
                  onClick={() => navigate(`/pomodoro/${task.pomodoroId}`)}
                >
                  뽀모도로 실행하기
                </Button>
              ) : (
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
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
