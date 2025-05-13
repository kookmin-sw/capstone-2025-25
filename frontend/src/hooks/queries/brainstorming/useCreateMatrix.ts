import { useMutation } from '@tanstack/react-query';
import { brainstormingService } from '@/services/brainstormingService';
import { CreateMatrixReq } from '@/types/api/brainstorming';

const useCreateMatrix = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: ({
      bubbleId,
      payload,
    }: {
      bubbleId: number;
      payload: CreateMatrixReq;
    }) => brainstormingService.createMatrix(bubbleId, payload),
  });

  return {
    createMatrixMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useCreateMatrix;
