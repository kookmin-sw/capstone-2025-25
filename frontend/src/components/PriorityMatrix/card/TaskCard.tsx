'use client';

import { useDraggable } from '@dnd-kit/core';
import { Calendar } from 'lucide-react';
import type { Task } from '@/types/task';
import { CategoryBadge } from '@/components/PriorityMatrix/filter/CategoryBadge';
import { TypeBadge } from '@/components/PriorityMatrix/filter/TypeBadge';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  layout?: 'matrix' | 'board' | 'list';
}

export function TaskCard({ task, onClick, layout = 'matrix' }: TaskCardProps) {
  const { id, title, memo, date, tags } = task;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: {
      ...task,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-md p-3 ${
        layout === 'board' ? 'w-full' : 'mb-2'
      } ${
        isDragging ? 'opacity-50' : ''
      } transition-shadow duration-200 cursor-pointer hover:shadow-md border border-gray-100 flex flex-col`}
      onClick={onClick}
    >
      <div className="flex mb-2 flex-wrap gap-1">
        <TypeBadge type={tags.type} />
        {tags.category && (
          <CategoryBadge
            label={tags.category}
            colorClass="bg-yellow-100 text-yellow-600"
          />
        )}
      </div>

      <div className="flex items-start mb-2 flex-grow">
        <div className="w-4 h-4 rounded-full border-2 border-[#8d5cf6] mr-2 mt-0.5 flex-shrink-0"></div>
        <div className="text-sm font-medium line-clamp-2">{title}</div>
      </div>

      {memo && (
        <div className="text-xs text-[#6e726e] mb-2 line-clamp-2">{memo}</div>
      )}

      {date && (
        <div className="text-xs text-[#6e726e] flex items-center mt-auto">
          <Calendar className="w-3 h-3 mr-1" />
          <span>
            {typeof date === 'string' ? date : date.toISOString().split('T')[0]}
          </span>
        </div>
      )}
    </div>
  );
}
