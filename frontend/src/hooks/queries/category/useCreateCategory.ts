import { useMutation } from '@tanstack/react-query';
import { eisenhowerCategoryService } from '@/services/eisenhowerCategoryService';

type CreateCategoryPayload = {
  title: string;
  color: string;
};

const useCreateCategory = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      eisenhowerCategoryService.create(payload),
  });

  return {
    createCategoryMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useCreateCategory;
