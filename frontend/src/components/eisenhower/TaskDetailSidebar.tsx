'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Edit2, Tag, Calendar, Save, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import type { Task } from '@/types/task';
import { CreateMindmapModal } from '@/components/eisenhower/modal/CreateMindmapModal';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge.tsx';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge.tsx';
import { SingleDatePicker } from '@/components/eisenhower/filter/SingleDatePicker.tsx';
import { useOutsideClick } from '@/hooks/useOutsideClick.ts';

type TaskDetailSidebarProps = {
  task: Task | null;
  onClose: () => void;
  isOpen: boolean;
  onSave?: (updatedTask: Task) => void;
  onDelete?: (taskId: string) => void;
  categories: string[];
  onAddCategory?: (category: string) => void;
  onDeleteCategory?: (category: string) => void;
};

const CATEGORY_COLOR_PALETTE = [
  'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600',
  'bg-orange-100 text-orange-600',
  'bg-amber-100 text-amber-600',
  'bg-blue-100 text-blue-600',
  'bg-gray-100 text-gray-600',
];

export function TaskDetailSidebar({
  task,
  onClose,
  isOpen,
  onSave,
  onDelete,
  categories,
  onAddCategory,
  onDeleteCategory,
}: TaskDetailSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [isMindmapModalOpen, setIsMindmapModalOpen] = useState(false); // 마인드맵 모달

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  // Category management
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(
    CATEGORY_COLOR_PALETTE[0],
  );

  const categoryRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useOutsideClick(categoryRef, () => {
    setIsCategoryDropdownOpen(false);
    if (isEditingCategories) {
      setIsEditingCategories(false);
    }
  });

  useOutsideClick(typeRef, () => setIsTypeDropdownOpen(false));

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

  const handleTypeChange = (type: 'TODO' | 'THINKING') => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        tags: { ...editedTask.tags, type },
      });
    }
  };

  const handleAddCategory = () => {
    if (
      newCategory.trim() &&
      !categories.includes(newCategory.trim()) &&
      onAddCategory
    ) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    if (onDeleteCategory) {
      onDeleteCategory(categoryToDelete);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
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
              {' >>'}
              {/*TODO: 아이콘 lucide-react*/}
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
              <div className="flex items-center relative" ref={typeRef}>
                <div className="w-5 h-5 rounded-full border-2 border-[#8d5cf6] mr-3"></div>
                <span className="text-sm mr-4">타입</span>

                {isEditing ? (
                  <div className="relative">
                    <div
                      className="cursor-pointer"
                      onClick={() => setIsTypeDropdownOpen((prev) => !prev)}
                    >
                      <TypeBadge type={editedTask.tags.type} />
                    </div>

                    {isTypeDropdownOpen && (
                      <div className="absolute mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-40">
                        <div className="p-2 space-y-1">
                          {(['TODO', 'THINKING'] as const).map((type) => (
                            <div
                              key={type}
                              className="cursor-pointer px-3 py-2 rounded-md hover:bg-gray-50"
                              onClick={() => {
                                handleTypeChange(type);
                                setIsTypeDropdownOpen(false);
                              }}
                            >
                              <TypeBadge type={type} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <TypeBadge type={task.tags.type} />
                )}
              </div>

              <div className="flex items-center" ref={categoryRef}>
                <Tag className="w-5 h-5 text-[#8d5cf6] mr-3" />
                <span className="text-sm mr-4">카테고리</span>
                {isEditing ? (
                  <div className="relative">
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white border border-gray-200 cursor-pointer"
                      onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                    >
                      <span className="mr-2 text-sm">카테고리 선택</span>
                      <CategoryBadge
                        label={editedTask.tags.category || '없음'}
                        colorClass="bg-gray-100 text-gray-600"
                      />
                    </div>

                    {isCategoryDropdownOpen && (
                      <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-md w-48">
                        <div className="p-2">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium">카테고리</h4>
                            <button
                              onClick={() =>
                                setIsEditingCategories(!isEditingCategories)
                              }
                              className="text-xs text-purple-600 hover:underline"
                            >
                              {isEditingCategories ? '완료' : '수정'}
                            </button>
                          </div>

                          {isEditingCategories ? (
                            <div className="mb-3">
                              <div className="flex items-center mb-2">
                                <input
                                  type="text"
                                  value={newCategory}
                                  onChange={(e) =>
                                    setNewCategory(e.target.value)
                                  }
                                  onKeyDown={handleKeyDown}
                                  placeholder="새 카테고리 추가"
                                  className="flex-1 text-sm border border-gray-200 rounded-md px-2 py-1"
                                />
                                <button
                                  onClick={handleAddCategory}
                                  className="ml-2 p-1 rounded-md bg-purple-100 text-purple-600 hover:bg-purple-200"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <select
                                value={newCategoryColor}
                                onChange={(e) =>
                                  setNewCategoryColor(e.target.value)
                                }
                                className="text-sm border border-gray-200 rounded-md py-1 w-full mb-2"
                              >
                                {CATEGORY_COLOR_PALETTE.map((color) => (
                                  <option key={color} value={color}>
                                    {color.split(' ').slice(-1)[0]}
                                  </option>
                                ))}
                              </select>
                              <div className="space-y-1 max-h-40 overflow-y-auto">
                                {categories.map((cat) => (
                                  <div
                                    key={cat}
                                    className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-gray-50"
                                  >
                                    <CategoryBadge
                                      label={cat}
                                      colorClass="bg-yellow-100 text-yellow-600"
                                    />
                                    <button
                                      onClick={() => handleDeleteCategory(cat)}
                                      className="text-gray-400 hover:text-red-500"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                className={`px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-50`}
                                onClick={() => {
                                  setEditedTask({
                                    ...editedTask,
                                    tags: { ...editedTask.tags, category: '' },
                                  });
                                  setIsCategoryDropdownOpen(false);
                                }}
                              >
                                <CategoryBadge
                                  label="카테고리 없음"
                                  colorClass="bg-gray-100 text-gray-600"
                                />
                              </div>
                              {categories.map((cat) => (
                                <div
                                  key={cat}
                                  className={`px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-50`}
                                  onClick={() => {
                                    setEditedTask({
                                      ...editedTask,
                                      tags: {
                                        ...editedTask.tags,
                                        category: cat,
                                      },
                                    });
                                    setIsCategoryDropdownOpen(false);
                                  }}
                                >
                                  <CategoryBadge
                                    label={cat}
                                    colorClass="bg-yellow-100 text-yellow-600"
                                  />
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  task.tags.category && (
                    <CategoryBadge
                      label={task.tags.category}
                      colorClass="bg-yellow-100 text-yellow-600"
                    />
                  )
                )}
              </div>

              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-[#8d5cf6] mr-3" />
                <span className="text-sm mr-4">마감일</span>
                {isEditing ? (
                  <SingleDatePicker date={new Date()} />
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
