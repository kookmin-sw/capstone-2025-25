'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Edit2, Tag, Calendar, Save } from 'lucide-react';
import { format } from 'date-fns';
import type { Task } from '@/types/task';
import { CreateMindmapModal } from '@/components/PriorityMatrix/common/CreateMindmapModal';

interface TaskDetailSidebarProps {
  task: Task | null;
  onClose: () => void;
  isOpen: boolean;
  onSave?: (updatedTask: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskDetailSidebar({
  task,
  onClose,
  isOpen,
  onSave,
}: TaskDetailSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isMindmapModalOpen, setIsMindmapModalOpen] = useState(false); // 마인드맵 모달

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setIsEditing(false);
    } else {
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const savedCategories = localStorage.getItem('taskCategories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories([
        'category',
        'work',
        'personal',
        'study',
        'health',
        'dev',
        'marketing',
      ]);
    }
  }, []);

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  if (!mounted || !task || !editedTask) return null;

  const formattedDate = task.date
    ? typeof task.date === 'string'
      ? format(new Date(task.date), 'yyyy.MM.dd')
      : format(task.date, 'yyyy.MM.dd')
    : '';

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (editedTask && onSave) {
      onSave(editedTask);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (task) {
      setEditedTask({ ...task });
    }
    setIsEditing(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, title: e.target.value });
    }
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, memo: e.target.value });
    }
  };

  const handleTypeChange = (type: 'Todo' | 'Thinking') => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        tags: { ...editedTask.tags, type },
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        tags: { ...editedTask.tags, category: e.target.value },
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, date: e.target.value });
    }
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <button
              onClick={isEditing ? handleCancelEdit : onClose}
              className="p-2 rounded-full hover:bg-[#f5f1ff]"
            >
              {'>>'}
            </button>
            <h2 className="text-lg font-semibold">
              {isEditing ? '작업 편집' : '작업 상세'}
            </h2>
            {isEditing ? (
              <button
                onClick={handleSaveClick}
                className="p-2 rounded-full hover:bg-[#f5f1ff]"
              >
                <Save className="w-5 h-5 text-[#8d5cf6]" />
              </button>
            ) : (
              <button
                onClick={handleEditClick}
                className="p-2 rounded-full hover:bg-[#f5f1ff]"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="text-sm text-[#6e726e] mb-2">{task.section}</div>

            {isEditing ? (
              <input
                type="text"
                value={editedTask.title}
                onChange={handleTitleChange}
                className="text-3xl font-bold mb-8 w-full border-b border-gray-200 focus:outline-none focus:border-[#8d5cf6] pb-2"
              />
            ) : (
              <h1 className="text-3xl font-bold mb-8">{task.title}</h1>
            )}

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border-2 border-[#8d5cf6] mr-3"></div>
                <span className="text-sm mr-4">타입</span>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      className={`px-3 py-1 rounded-full text-xs ${
                        editedTask.tags.type === 'Todo'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                      onClick={() => handleTypeChange('Todo')}
                    >
                      Todo
                    </button>
                    <button
                      className={`px-3 py-1 rounded-full text-xs ${
                        editedTask.tags.type === 'Thinking'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                      onClick={() => handleTypeChange('Thinking')}
                    >
                      Thinking
                    </button>
                  </div>
                ) : (
                  <div
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      task.tags.type === 'Todo'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {task.tags.type}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <Tag className="w-5 h-5 text-[#8d5cf6] mr-3" />
                <span className="text-sm mr-4">카테고리</span>
                {isEditing ? (
                  <select
                    value={editedTask.tags.category || ''}
                    onChange={handleCategoryChange}
                    className="text-xs px-2 py-1 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#8d5cf6]"
                  >
                    <option value="">카테고리 없음</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                ) : (
                  task.tags.category && (
                    <div className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {task.tags.category}
                    </div>
                  )
                )}
              </div>

              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-[#8d5cf6] mr-3" />
                <span className="text-sm mr-4">마감일</span>
                {isEditing ? (
                  <input
                    type="date"
                    value={
                      typeof editedTask.date === 'string'
                        ? editedTask.date.split('.').join('-')
                        : ''
                    }
                    onChange={handleDateChange}
                    className="text-xs px-2 py-1 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#8d5cf6]"
                  />
                ) : (
                  <span>{formattedDate}</span>
                )}
              </div>
            </div>

            <div className="h-px bg-[#e5e5e5] my-6"></div>

            <div className="mb-8">
              {isEditing ? (
                <textarea
                  value={editedTask.memo || ''}
                  onChange={handleMemoChange}
                  placeholder="메모를 입력하세요"
                  className="w-full h-32 p-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8d5cf6]"
                />
              ) : (
                <p className="text-sm">{task.memo}</p>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-[#e5e5e5] flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 py-3 border border-[#e5e5e5] rounded-md text-sm font-medium hover:bg-[#f5f1ff]"
                >
                  취소하기
                </button>
                <button
                  onClick={handleSaveClick}
                  className="flex-1 py-3 bg-[#222222] text-white rounded-md text-sm font-medium hover:bg-[#333333]"
                >
                  저장하기
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsMindmapModalOpen(true)}
                  className="flex-1 py-3 border border-[#e5e5e5] rounded-md text-sm font-medium hover:bg-[#f5f1ff]"
                >
                  마인드맵 그리기
                </button>
                <button
                  onClick={handleEditClick}
                  className="flex-1 py-3 bg-[#222222] text-white rounded-md text-sm font-medium hover:bg-[#333333]"
                >
                  뽀모도로 실행하기
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <CreateMindmapModal
        isOpen={isMindmapModalOpen}
        onClose={() => setIsMindmapModalOpen(false)}
        onCreate={(mindmap) => {
          console.log('생성된 마인드맵:', mindmap);
          // 여기에 마인드맵 데이터 저장 로직 추가
        }}
      />
    </>
  );
}
