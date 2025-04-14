import { useState } from 'react';
import {
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import type { Task, Quadrant } from '@/types/task.ts';
import useMatrixStore from '@/store/matrixStore';

export function useTaskDnD() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const tasks = useMatrixStore((state) => state.tasks);
  const reorderTasks = useMatrixStore((state) => state.reorderTasks);
  const updateTask = useMatrixStore((state) => state.updateTask);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const getSectionIdByTaskId = (
    taskId: string | number,
  ): Quadrant | undefined => {
    const entry = Object.entries(tasks).find(([_, taskList]) =>
      taskList.some((task) => task.id === taskId),
    );
    return entry ? (entry[0] as Quadrant) : undefined;
  };

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

    // overId가 Quadrant 타입인지 먼저 확인
    const isQuadrant = ['Q1', 'Q2', 'Q3', 'Q4'].includes(overId);
    const targetSectionId = isQuadrant
      ? (overId as Quadrant)
      : getSectionIdByTaskId(overId);

    if (!sourceSectionId || !targetSectionId) return;
    if (sourceSectionId === targetSectionId && activeId === overId) return;

    // 드래그한 작업 찾기
    const source = [...tasks[sourceSectionId]];
    const taskIndex = source.findIndex((t) => t.id === activeId);
    if (taskIndex === -1) return;

    const taskToMove = source[taskIndex];
    source.splice(taskIndex, 1);

    // 같은 섹션 내 재정렬
    if (sourceSectionId === targetSectionId) {
      const overIndex = source.findIndex((t) => t.id === overId);
      if (overIndex !== -1) {
        source.splice(overIndex, 0, taskToMove);
      } else {
        source.push(taskToMove);
      }

      reorderTasks(targetSectionId, source);
      return;
    }

    // 다른 섹션으로 이동
    reorderTasks(sourceSectionId, source);

    const updatedTask = { ...taskToMove, quadrant: targetSectionId };
    updateTask(targetSectionId, updatedTask.id, updatedTask);
  };

  return {
    activeTask,
    sensors,
    handleDragStart,
    handleDragEnd,
  };
}
