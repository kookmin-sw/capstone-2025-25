import { useCategoryStore } from '@/store/useCategoryStore';
import { DateRangePicker } from '@/components/eisenhower/filter/DateRangePicker';
import { TypeBadge } from '@/components/eisenhower/filter/TypeBadge';
import { CategoryBadge } from '@/components/eisenhower/filter/CategoryBadge';
import { BadgeSelector } from '@/components/common/BadgeSelector';

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
  const { categories } = useCategoryStore();

  const typeOptions = [
    { label: '전체', value: 'ALL' },
    { label: '할 일', value: 'TODO' },
    { label: '생각', value: 'THINKING' },
  ] as const;

  const categoryOptions = [
    {
      label: '모든 카테고리',
      value: 'all',
      bgColor: '#E5E5E5',
      textColor: '#6B7280',
    },
    ...categories.map((cat) => ({
      label: cat.title,
      value: cat.title,
      bgColor: cat.color,
      textColor: cat.textColor,
    })),
  ];

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* 타입 필터 */}
          <BadgeSelector
            options={typeOptions as unknown as any}
            selected={selectedType}
            onChange={(value) =>
              onTypeChange(value as 'ALL' | 'TODO' | 'THINKING')
            }
            label="타입"
            renderBadge={(option) => (
              <TypeBadge type={option.value as 'ALL' | 'TODO' | 'THINKING'} />
            )}
            withSearch={false}
          />

          {/* 카테고리 필터 */}
          <BadgeSelector
            options={categoryOptions}
            selected={selectedCategory}
            onChange={onCategoryChange}
            label="카테고리"
            renderBadge={(option) => (
              <CategoryBadge
                label={option.label}
                bgColor={option.bgColor}
                textColor={option.textColor}
              />
            )}
            withSearch={false}
          />

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
