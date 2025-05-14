import { useQuery } from '@tanstack/react-query';
import { CategoryListRes } from '@/types/api/category';
import { categoryService } from '@/services/categoryService';

const useGetCategoryList = () => {
  const { data, isLoading, error, isPending } = useQuery<CategoryListRes>({
    queryKey: ['CategoryList'],
    queryFn: () => categoryService.getList(),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 30,
  });

  const getCategoryNameById = (id: number | string) => {
    if (!data?.content || data.content.length === 0) {
      return null;
    }

    const category = data.content.find(
      (cat) => cat.id === id || cat.id === Number(id),
    );
    return category ? category.title : null;
  };

  const getCategoryColorById = (id: number | string) => {
    if (!data?.content || data.content.length === 0) {
      return null;
    }

    const category = data.content.find(
      (cat) => cat.id === id || cat.id === Number(id),
    );
    return category?.color || null;
  };

  return {
    categoryList: data?.content,
    isLoading,
    error,
    isPending,
    getCategoryNameById,
    getCategoryColorById,
  };
};

export default useGetCategoryList;
