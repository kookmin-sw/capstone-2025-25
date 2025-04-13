import { useState } from 'react';
import type { TaskType } from '@/types/task.ts';

export function useTaskFilters() {
  const [selectedType, setSelectedType] = useState<TaskType>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>(new Date('2022-01-01'));
  const [endDate, setEndDate] = useState<Date>(new Date('2025-12-31'));

  const setDateRange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return {
    selectedType,
    setSelectedType,
    selectedCategory,
    setSelectedCategory,
    startDate,
    endDate,
    setDateRange,
  };
}
