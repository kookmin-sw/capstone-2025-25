import { useState } from 'react';
import {
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import type { Task } from '@/types/task.ts';
import useMatrixStore from '@/store/matrixStore';
import { Quadrant } from '@/types/commonTypes';

export function useTaskDnD() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const tasksByQuadrant = useMatrixStore((state) => state.tasksByQuadrant);
  const reorderTasks = useMatrixStore((state) => state.reorderTasks);
  const updateTask = useMatrixStore((state) => state.updateTask);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const getSectionIdByTaskId = (
    taskId: string | number,
  ): Quadrant | undefined => {
    for (const [quadrant, tasks] of Object.entries(tasksByQuadrant)) {
      if (tasks.some((task) => task.id === taskId)) {
        return quadrant as Quadrant;
      }
    }
    return undefined;
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    const sectionId = getSectionIdByTaskId(active.id as string | number);
    if (!sectionId) return;

    const task = tasksByQuadrant[sectionId].find(
      (task) => task.id === active.id,
    );
    if (task) setActiveTask(task);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string | number;
    const overId = over.id as string | number;

    const sourceSectionId = getSectionIdByTaskId(activeId);
    const isQuadrant = ['Q1', 'Q2', 'Q3', 'Q4'].includes(String(overId));
    const targetSectionId = isQuadrant
      ? (overId as Quadrant)
      : getSectionIdByTaskId(overId);

    if (!sourceSectionId || !targetSectionId) return;
    if (sourceSectionId === targetSectionId && activeId === overId) return;

    const source = [...tasksByQuadrant[sourceSectionId]];
    const taskIndex = source.findIndex((t) => t.id === activeId);
    if (taskIndex === -1) return;

    const taskToMove = source[taskIndex];
    source.splice(taskIndex, 1);

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

    reorderTasks(sourceSectionId, source);

    const updatedTask = { ...taskToMove, quadrant: targetSectionId };
    updateTask(updatedTask.id, updatedTask);
  };

  return {
    activeTask,
    sensors,
    handleDragStart,
    handleDragEnd,
  };
}
