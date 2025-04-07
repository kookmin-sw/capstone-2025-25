'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, X, Check, Edit2 } from 'lucide-react';
import { DateRangePicker } from '@/components/PriorityMatrix/common/DateRangePicker';

interface FilterBarProps {
  selectedType: 'all' | 'Todo' | 'Thinking';
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onTypeChange: (type: 'all' | 'Todo' | 'Thinking') => void;
  onCategoryChange: (category: string) => void;
  onDateChange: (start: Date, end: Date) => void;
}

export function FilterBar({
  selectedType,
  selectedCategory,
  startDate,
  endDate,
  onTypeChange,
  onCategoryChange,
  onDateChange,
}: FilterBarProps) {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([
    'category',
    'work',
    'personal',
    'study',
    'health',
    'dev',
    'marketing',
  ]);

  const typeRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const newCategoryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
        setIsEditMode(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // 편집 모드가 활성화되면 입력 필드에 포커스
    if (isEditMode && newCategoryInputRef.current) {
      newCategoryInputRef.current.focus();
    }
  }, [isEditMode]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    // 선택된 카테고리가 삭제되는 경우 'all'로 변경
    if (selectedCategory === categoryToDelete) {
      onCategoryChange('all');
    }
    setCategories(
      categories.filter((category) => category !== categoryToDelete),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* 타입 필터 */}
          <div className="relative" ref={typeRef}>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            >
              <span className="text-sm font-medium">타입</span>
              <ChevronDown className="w-4 h-4" />
            </div>

            {/* 선택된 타입 표시 */}
            {selectedType !== 'all' && (
              <div
                className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs ${
                  selectedType === 'Todo'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                <span className="mr-1">•</span>
                {selectedType}
              </div>
            )}

            {isTypeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-40">
                <div className="p-2 space-y-1">
                  {['Todo', 'Thinking'].map((type) => (
                    <div
                      key={type}
                      className={`px-3 py-2 text-sm rounded-md cursor-pointer flex items-center ${
                        selectedType === type
                          ? 'bg-gray-100'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        onTypeChange(type as 'Todo' | 'Thinking');
                        setIsTypeDropdownOpen(false);
                      }}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${type === 'Todo' ? 'bg-purple-500' : 'bg-blue-500'}`}
                      ></div>
                      {type}
                    </div>
                  ))}
                  <div
                    className={`px-3 py-2 text-sm rounded-md cursor-pointer ${
                      selectedType === 'all'
                        ? 'bg-gray-100'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onTypeChange('all');
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    모든 타입
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 카테고리 필터 */}
          <div className="relative" ref={categoryRef}>
            <div className="flex items-center space-x-2">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => {
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                  setIsEditMode(false);
                }}
              >
                <span className="text-sm font-medium">카테고리</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              {!isEditMode && (
                <button
                  className="p-1 rounded-full hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCategoryDropdownOpen(true);
                    setIsEditMode(true);
                  }}
                >
                  <Edit2 className="w-3 h-3 text-gray-500" />
                </button>
              )}
            </div>

            {/* 선택된 카테고리 표시 */}
            {selectedCategory !== 'all' && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">
                {selectedCategory}
              </div>
            )}

            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-64 max-h-80 overflow-y-auto">
                {isEditMode ? (
                  <div className="p-3">
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2">
                        카테고리 관리
                      </h4>
                      <div className="flex items-center">
                        <input
                          ref={newCategoryInputRef}
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="새 카테고리 추가"
                          className="flex-1 text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                        <button
                          onClick={handleAddCategory}
                          className="ml-2 p-1 rounded-md bg-purple-100 text-purple-600 hover:bg-purple-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-gray-50"
                        >
                          <span className="text-sm">{category}</span>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="p-1 rounded-full hover:bg-red-100 text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => setIsEditMode(false)}
                        className="px-3 py-1 text-xs bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        완료
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-2">
                    <div
                      className={`px-3 py-2 text-sm rounded-md cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-gray-100'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        onCategoryChange('all');
                        setIsCategoryDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span>모든 카테고리</span>
                        {selectedCategory === 'all' && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-1 mt-1">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className={`px-3 py-2 text-sm rounded-md cursor-pointer ${
                            selectedCategory === category
                              ? 'bg-gray-100'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            onCategoryChange(category);
                            setIsCategoryDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <span>{category}</span>
                            {selectedCategory === category && (
                              <Check className="w-4 h-4 ml-auto" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="relative" ref={typeRef}>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            >
              <span className="text-sm font-medium">날짜</span>
            </div>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateChange={onDateChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
