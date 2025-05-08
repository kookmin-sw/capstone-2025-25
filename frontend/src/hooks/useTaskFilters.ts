import { useState } from 'react';

export function useTaskFilters() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now()));
  const [endDate, setEndDate] = useState<Date>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 10);
    return today;
  });

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
