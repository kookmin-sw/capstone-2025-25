import { useCategoryStore } from '@/store/useCategoryStore';
import { DateRangePicker } from '@/components/eisenhower/filter/DateRangePicker';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { BadgeSelector } from '@/components/common/BadgeSelector';

interface FilterBarProps {
  selectedCategory: string;
  startDate: Date | null;
  endDate: Date | null;
  onCategoryChange: (category: string) => void;
  onDateChange: (start: Date, end: Date) => void;
}

export function FilterBar({
  selectedCategory,
  startDate,
  endDate,
  onCategoryChange,
  onDateChange,
}: FilterBarProps) {
  const { categories } = useCategoryStore();

  const categoryOptions = [
    {
      label: '전체',
      value: 'all',
      color: '#E1E1E8',
    },
    ...categories.map((cat) => ({
      label: cat.title,
      value: cat.title,
      bgColor: cat.color,
    })),
  ];

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-300">
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* 카테고리 필터 */}
          <BadgeSelector
            options={categoryOptions}
            selected={selectedCategory}
            onChange={onCategoryChange}
            label="카테고리"
            renderBadge={(option) => (
              <CategoryBadge
                label={option.label}
                bgColor={option?.bgColor ?? '#E8EFFF'}
                textColor={option.textColor}
              />
            )}
            withSearch={false}
          />

          <div className="bg-[#F0F0F5] rounded-md h-6 w-1 md:block hidden"></div>
          {/* 날짜 필터 */}
          <div className="relative flex gap-4 items-center">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-[16px] font-regular whitespace-nowrap">
                날짜
              </span>
            </div>
            <div>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onDateChange={onDateChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
