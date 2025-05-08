import { useMutation } from '@tanstack/react-query';
import { brainstormingService } from '@/services/brainstormingService';
import { PatchBubbleReq } from '@/types/api/brainstorming';

const usePatchBubble = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchBubbleReq }) =>
      brainstormingService.patchBubble(id, data),
  });

  return {
    patchBrainStormingMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default usePatchBubble;
