import { useCategoryStore } from '@/store/useCategoryStore';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { DateRangePicker } from '@/components/eisenhower/filter/DateRangePicker';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge.tsx';

interface FilterBarProps {
  selectedType: 'ALL' | 'TODO' | 'THINKING';
  selectedCategory: string;
  startDate: Date;
  endDate: Date;
  onTypeChange: (type: 'ALL' | 'TODO' | 'THINKING') => void;
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

  const { categories } = useCategoryStore();

  const typeRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

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
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // const getCategoryColor = (title: string) => (title === 'all' ? '' : '');

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* 타입 필터 */}
          {/* 타입 필터 */}
          <div className="relative w-22" ref={typeRef}>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            >
              <span className="text-sm font-medium">타입</span>
              <ChevronDown className="w-4 h-4" />
            </div>

            {/* 현재 선택된 타입 뱃지 */}
            <div className="mt-2">
              <TypeBadge type={selectedType} />
            </div>

            {isTypeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-30">
                <div className="p-1 space-y-1">
                  {(['ALL', 'TODO', 'THINKING'] as const).map((type) => (
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
          <div className="relative w-30" ref={categoryRef}>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <span className="text-sm font-medium">카테고리</span>
              <ChevronDown className="w-4 h-4" />
            </div>

            {/* 현재 선택된 카테고리 뱃지 */}
            <div className="mt-2">
              {selectedCategory === 'all' ? (
                <CategoryBadge
                  label="모든 카테고리"
                  bgColor="#E5E5E5"
                  textColor="#6B7280"
                />
              ) : (
                (() => {
                  const selected = categories.find(
                    (cat) => cat.title === selectedCategory,
                  );
                  return (
                    <CategoryBadge
                      label={selected?.title || selectedCategory}
                      bgColor={selected?.color}
                      textColor={selected?.textColor}
                    />
                  );
                })()
              )}
            </div>

            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-40 max-h-80 overflow-y-auto">
                <div className="p-1">
                  {/* 모든 카테고리 항목 */}
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
                    <div className="flex items-center gap-2">
                      <CategoryBadge
                        label="모든 카테고리"
                        bgColor="#E5E5E5"
                        textColor="#6B7280"
                      />
                      {selectedCategory === 'all' && (
                        <Check className="w-4 h-4 ml-auto" />
                      )}
                    </div>
                  </div>

                  {/* 카테고리 리스트 */}
                  <div className="grid grid-cols-1 gap-1 mt-1">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
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
                        <div className="flex items-center gap-2">
                          <CategoryBadge
                            label={cat.title}
                            bgColor={cat.color}
                            textColor={cat.textColor}
                          />
                          {selectedCategory === cat.title && (
                            <Check className="w-4 h-4 ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
