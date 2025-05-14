import { useState } from 'react';

export function useTaskFilters() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const setDateRange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return {
    selectedCategory,
    setSelectedCategory,
    startDate,
    endDate,
    setDateRange,
  };
}
