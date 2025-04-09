'use client';

import { useState, useRef, useEffect } from 'react';
import type React from 'react';
import { ChevronDown, Plus, Check } from 'lucide-react';
import { DateRangePicker } from '@/components/PriorityMatrix/filter/DateRangePicker';
import { CategoryBadge } from '@/components/PriorityMatrix/filter/CategoryBadge';
import { TypeBadge } from '@/components/PriorityMatrix/filter/TypeBadge';

interface Category {
  title: string;
  color: string;
}

interface FilterBarProps {
  selectedType: 'all' | 'Todo' | 'Thinking';
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onTypeChange: (type: 'all' | 'Todo' | 'Thinking') => void;
  onCategoryChange: (category: string) => void;
  onDateChange: (start: Date, end: Date) => void;
}

const CATEGORY_COLOR_PALETTE = [
  'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600',
  'bg-orange-100 text-orange-600',
  'bg-amber-100 text-amber-600',
  'bg-blue-100 text-blue-600',
  'bg-gray-100 text-gray-600',
];

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
  const [newCategoryColor, setNewCategoryColor] = useState(
    CATEGORY_COLOR_PALETTE[0],
  );

  const [categories, setCategories] = useState<Category[]>([
    { title: 'category', color: CATEGORY_COLOR_PALETTE[0] },
    { title: 'work', color: CATEGORY_COLOR_PALETTE[1] },
    { title: 'personal', color: CATEGORY_COLOR_PALETTE[2] },
    { title: 'study', color: CATEGORY_COLOR_PALETTE[3] },
    { title: 'health', color: CATEGORY_COLOR_PALETTE[4] },
    { title: 'dev', color: CATEGORY_COLOR_PALETTE[5] },
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
    if (isEditMode && newCategoryInputRef.current) {
      newCategoryInputRef.current.focus();
    }
  }, [isEditMode]);

  const handleAddCategory = () => {
    if (
      newCategory.trim() &&
      !categories.find((c) => c.title === newCategory.trim())
    ) {
      setCategories([
        ...categories,
        { title: newCategory.trim(), color: newCategoryColor },
      ]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (titleToDelete: string) => {
    if (selectedCategory === titleToDelete) {
      onCategoryChange('all');
    }
    setCategories(categories.filter((c) => c.title !== titleToDelete));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  const getCategoryColor = (title: string) =>
    title === 'all'
      ? 'bg-gray-200 text-gray-600'
      : (categories.find((c) => c.title === title)?.color ??
        'bg-gray-100 text-gray-600');

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* 타입 필터 */}
          {/* 타입 필터 */}
          <div className="relative" ref={typeRef}>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            >
              <span className="text-sm font-medium">타입</span>
              <ChevronDown className="w-4 h-4" />
            </div>

            {/* 선택된 타입 뱃지 */}
            <div
              className={`mt-2 inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${
                selectedType === 'all'
                  ? 'border-gray-300 text-gray-500'
                  : 'border-[#8D5CF6] text-[#8D5CF6]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  selectedType === 'all' ? 'bg-gray-400' : 'bg-[#8D5CF6]'
                }`}
              ></span>
              {selectedType === 'all' ? '모든 타입' : selectedType}
            </div>

            {/* 드롭다운 */}
            {isTypeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-40">
                <div className="p-2 space-y-1">
                  {(['all', 'Todo', 'Thinking'] as const).map((type) => (
                    <div
                      key={type}
                      className={`px-3 py-2 text-sm rounded-md cursor-pointer ${
                        selectedType === type
                          ? 'bg-gray-100'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        onTypeChange(type);
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

          {/* 카테고리 필터 */}
          <div className="relative" ref={categoryRef}>
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
            <div
              className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs ${getCategoryColor(
                selectedCategory,
              )}`}
            >
              {selectedCategory === 'all' ? '모든 카테고리' : selectedCategory}
            </div>
            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-64 max-h-80 overflow-y-auto">
                <div className="p-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">카테고리</h4>
                    <button
                      onClick={() => setIsEditMode(!isEditMode)}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      {isEditMode ? '완료' : '수정'}
                    </button>
                  </div>
                  {isEditMode ? (
                    <>
                      <div className="flex flex-col mb-3">
                        <input
                          ref={newCategoryInputRef}
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="새 카테고리 추가"
                          className="flex-1 text-sm border border-gray-200 rounded-md px-2 py-1"
                        />
                        <div className="flex justify-between items-center py-3">
                          <select
                            value={newCategoryColor}
                            onChange={(e) =>
                              setNewCategoryColor(e.target.value)
                            }
                            className="text-sm border border-gray-200 rounded-md py-1"
                          >
                            {CATEGORY_COLOR_PALETTE.map((color) => (
                              <option key={color} value={color}>
                                {color.split(' ').slice(-1)[0]}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={handleAddCategory}
                            className="p-1 rounded-md bg-purple-100 text-purple-600 hover:bg-purple-200 w-6 h-6"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {categories.map((cat) => (
                          <div
                            key={cat.title}
                            className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer"
                          >
                            <CategoryBadge
                              label={cat.title}
                              colorClass={cat.color}
                              showDelete
                              onDelete={() => handleDeleteCategory(cat.title)}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
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
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                              'all',
                            )}`}
                          >
                            모든 카테고리
                          </span>
                          {selectedCategory === 'all' && (
                            <Check className="w-4 h-4 ml-auto" />
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-1 mt-1">
                        {categories.map((cat) => (
                          <div
                            key={cat.title}
                            className={`px-3 py-2 text-sm rounded-md cursor-pointer ${
                              selectedCategory === cat.title
                                ? 'bg-gray-100'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              onCategoryChange(cat.title);
                              setIsCategoryDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${cat.color}`}
                              >
                                {cat.title}
                              </span>
                              {selectedCategory === cat.title && (
                                <Check className="w-4 h-4 ml-auto" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 날짜 필터 */}
          <div className="relative">
            <div className="flex items-center space-x-2 cursor-pointer">
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
