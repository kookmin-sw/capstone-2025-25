'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar } from 'lucide-react';
import type { Task } from '@/types/task';

interface SortableTaskCardProps {
  task: Task;
  onClick?: () => void;
  layout?: 'matrix' | 'board' | 'list';
}

export function SortableTaskCard({
  task,
  onClick,
  layout = 'matrix',
}: SortableTaskCardProps) {
  const { id, title, memo, date, tags } = task;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      ...task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="py-1 group">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-white rounded-md p-3 ${layout === 'board' ? 'w-full' : ''} ${
          isDragging
            ? 'opacity-50 z-10 shadow-lg border-2 border-purple-300'
            : 'border border-gray-100'
        } transition-all duration-200 cursor-pointer hover:shadow-md flex flex-col relative`}
        onClick={() => {
          // 드래그 중에는 onClick 이벤트가 발생하지 않도록 함
          if (!isDragging && onClick) {
            onClick();
          }
        }}
      >
        <div className="flex mb-2 flex-wrap gap-1">
          <div
            className={`inline-flex items-center ${tags.type === 'Todo' ? 'text-purple-600' : 'text-blue-600'}`}
          >
            <div
              className={`text-xs px-2 py-0.5 rounded-full ${
                tags.type === 'Todo'
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              {tags.type === 'Todo' && <span className="mr-1">•</span>}
              {tags.type}
            </div>
          </div>
          {tags.category && (
            <div className="inline-flex items-center">
              <div className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600">
                {tags.category}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start mb-2 flex-grow">
          <div className="w-5 h-5 rounded-full border-2 border-[#8d5cf6] mr-2 mt-0.5 flex-shrink-0"></div>
          <div className="text-sm font-medium line-clamp-2">{title}</div>
        </div>

        {memo && (
          <div className="text-xs text-[#6e726e] ml-7 mb-2 line-clamp-2">
            {memo}
          </div>
        )}

        {date && (
          <div className="text-xs text-[#6e726e] ml-7 flex items-center mt-auto">
            <Calendar className="w-3 h-3 mr-1" />
            <span>
              {typeof date === 'string'
                ? date
                : date.toISOString().split('T')[0]}
            </span>
          </div>
        )}
      </div>

      <div className="w-full group-hover:bg-purple-100 transition-colors duration-200"></div>
    </div>
  );
}
