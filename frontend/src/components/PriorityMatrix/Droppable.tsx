import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

interface DroppableProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function Droppable({ id, children, className = '' }: DroppableProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'bg-[#ede5ff] ring-2 ring-purple-300 ring-inset' : ''} transition-all duration-200`}
    >
      {children}
    </div>
  );
}
