import { useMutation } from '@tanstack/react-query';
import { brainstormingService } from '@/services/brainstormingService';
import { MergeBubbleReq } from '@/types/api/brainstorming';

const useApplyMergedBubble = () => {
    const { mutate, isPending, isError, error, data, reset } = useMutation({
        mutationFn: (data: MergeBubbleReq) =>
            brainstormingService.mergeBubble(data),
    });

    return {
        applyMergedBubbleMutation: mutate,
        isPending,
        isError,
        error,
        data,
        reset,
    };
};

export default useApplyMergedBubble;
