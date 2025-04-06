import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
// import { arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react';
import Column from './Column';
import { ColumnData, TaskCardType, initialData } from './data';
import DragOverlayCard from './DragOverlayCard';

export default function PriorityMatrix() {
  const [columns, setColumns] = useState<ColumnData>(initialData); // 객체 <- 메모리 주소 가지고 있음
  const [activeTask, setActiveTask] = useState<TaskCardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const getColumnId = (taskId: string): string | undefined =>
    Object.keys(columns).find((col) =>
      columns[col].some((task) => task.id === taskId),
    );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceCol = getColumnId(activeId);
    const targetCol = columns[overId] ? overId : getColumnId(overId);

    if (!sourceCol || !targetCol) return;

    const sourceItems = [...columns[sourceCol]]; // 복사해서 상태 변경하려고 복사함
    const targetItems = [...columns[targetCol]];

    const fromIndex = sourceItems.findIndex((task) => task.id === activeId);
    const dragged = sourceItems[fromIndex];
    if (!dragged) return;

    sourceItems.splice(fromIndex, 1);

    const toIndex = targetItems.findIndex((task) => task.id === overId);
    const insertAt = toIndex === -1 ? targetItems.length : toIndex + 1;
    targetItems.splice(insertAt, 0, dragged);

    setColumns((prev) => ({
      ...prev, // 기존 상태 유지
      [sourceCol]: sourceItems,
      [targetCol]: targetItems,
      // 드래그로 이동한 칼럼 두 개만 바꿔서 새롭게 만든 객체로 업데이트
    }));
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const columnId = getColumnId(String(active.id));
    const task = columnId
      ? columns[columnId].find((t) => t.id === active.id)
      : null;
    if (task) setActiveTask(task);
  };

  const handleDelete = (id: string) => {
    const columnId = getColumnId(id);
    if (!columnId) return;
    setColumns((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((task) => task.id !== id),
    }));
  };

  const handleAdd = (columnId: string) => {
    const newTask: TaskCardType = {
      id: Date.now().toString(),
      title: '새 작업',
    };
    setColumns((prev) => ({
      ...prev,
      [columnId]: [...prev[columnId], newTask],
    }));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(columns).map(([colId, tasks]) => (
          <Column
            key={colId}
            id={colId}
            tasks={tasks}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <DragOverlayCard title={activeTask.title} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
