import { useState } from 'react';
import {
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import type { Task } from '@/types/task.ts';

export function useTaskDnD({
  tasks,
  setTasks,
}: {
  tasks: Record<string, Task[]>;
  setTasks: React.Dispatch<React.SetStateAction<Record<string, Task[]>>>;
}) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const getSectionIdByTaskId = (taskId: string) =>
    Object.keys(tasks).find((sectionId) =>
      tasks[sectionId].some((task) => task.id === taskId),
    );

  const handleDragStart = ({ active }: DragStartEvent) => {
    const sectionId = getSectionIdByTaskId(active.id as string);
    if (!sectionId) return;
    const task = tasks[sectionId].find((task) => task.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceSectionId = getSectionIdByTaskId(activeId);
    const targetSectionId = getSectionIdByTaskId(overId) ?? overId;

    if (!sourceSectionId || !targetSectionId) return;
    if (sourceSectionId === targetSectionId && activeId === overId) return;

    setTasks((prev) => {
      const source = [...prev[sourceSectionId]];
      const target = [...prev[targetSectionId]];
      const taskIndex = source.findIndex((t) => t.id === activeId);
      if (taskIndex === -1) return prev;

      const [task] = source.splice(taskIndex, 1);
      const updatedTask = { ...task, section: targetSectionId };

      if (sourceSectionId === targetSectionId) {
        const overIndex = target.findIndex((t) => t.id === overId);
        target.splice(overIndex, 0, updatedTask);
        return { ...prev, [targetSectionId]: target };
      }

      return {
        ...prev,
        [sourceSectionId]: source,
        [targetSectionId]: [...target, updatedTask],
      };
    });
  };

  return {
    activeTask,
    sensors,
    handleDragStart,
    handleDragEnd,
  };
}
