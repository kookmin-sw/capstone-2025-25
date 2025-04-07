'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

interface CategoryManagerProps {
  onClose: () => void;
}

export function CategoryManager({ onClose }: CategoryManagerProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');

  // 로컬 스토리지에서 카테고리 불러오기
  useEffect(() => {
    const savedCategories = localStorage.getItem('taskCategories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // 기본 카테고리 설정
      const defaultCategories = [
        'category',
        'work',
        'personal',
        'study',
        'health',
        'dev',
        'marketing',
      ];
      setCategories(defaultCategories);
      localStorage.setItem('taskCategories', JSON.stringify(defaultCategories));
    }
  }, []);

  // 카테고리 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('taskCategories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    const updatedCategories = categories.filter(
      (category) => category !== categoryToDelete,
    );
    setCategories(updatedCategories);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">카테고리 관리</h3>

      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="새 카테고리 추가"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            onClick={handleAddCategory}
            className="ml-2 p-2 rounded-md bg-purple-100 text-purple-600 hover:bg-purple-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {categories.map((category) => (
          <div
            key={category}
            className="flex items-center justify-between py-2 px-3 border-b border-gray-100 hover:bg-gray-50 rounded-md"
          >
            <span className="text-sm">{category}</span>
            <button
              onClick={() => handleDeleteCategory(category)}
              className="p-1 rounded-full hover:bg-red-100 text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 text-sm font-medium"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
