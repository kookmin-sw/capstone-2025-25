import { useMutation } from '@tanstack/react-query';
import { brainstormingService } from '@/services/brainstormingService.ts';
import { CreateBubbleReq } from '@/types/api/brainstorming';

const useCreateRootNode = () => {
    const { mutate, isPending, isError, error, data, reset } = useMutation({
        mutationFn: (data: CreateBubbleReq) =>
            brainstormingService.createBubble(data),
    });

    return {
        createRootNodeMutation: mutate,
        isPending,
        isError,
        error,
        data,
        reset,
    };
};

export default useCreateRootNode;
