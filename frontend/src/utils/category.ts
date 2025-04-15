import { Category } from '@/types/category.ts';

export function getCategoryNameById(
  categoryId: number | null,
  categories: Category[],
): string {
  if (categoryId === null) return '카테고리 없음';
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : '알 수 없음';
}
