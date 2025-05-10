import { Category } from '@/types/category';

export type CategoryListRes = {
  statusCode: number;
  error: string | null;
  content: Category[];
};
