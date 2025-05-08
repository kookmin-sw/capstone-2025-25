import { Category } from '@/types/category.ts';

export function getCategoryNameById(
  categoryId: number | null,
  categories: Category[],
): string {
  if (categoryId === null) return '카테고리 없음';
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.title : '알 수 없음';
}

export const categoryThemes = [
  { bg: '#D9ECFF', text: '#4A90E2' },
  { bg: '#FDE4EF', text: '#E86CA5' },
  { bg: '#FCE1C6', text: '#F28C38' },
  { bg: '#FEF3C7', text: '#FBBF24' },
  { bg: '#D3F3E2', text: '#34A58E' },
  { bg: '#E5E5E5', text: '#6B7280' },
  { bg: '#FADBD7', text: '#E74C3C' },
  { bg: '#E8DCCB', text: '#8B572A' },
];
