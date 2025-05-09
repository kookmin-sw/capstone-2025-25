import { useMutation } from '@tanstack/react-query';
import { brainstormingService } from '@/services/brainstormingService.ts';

const useDeleteBubble = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (id: number) => brainstormingService.deleteBubble(id),
  });

  return {
    deleteBrainstormingMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useDeleteBubble;
