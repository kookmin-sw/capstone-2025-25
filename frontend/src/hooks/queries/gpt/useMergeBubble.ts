import { useMutation } from '@tanstack/react-query';
import { gptService } from '@/services/gptService';
import {MergeBubbleReq} from '@/types/api/gpt';

const useMergeBubble = () => {
    const { mutate,   isPending, isError, error, data, reset } = useMutation({
        mutationFn: (data: MergeBubbleReq) =>
            gptService.mergeBubble(data),
    });


    return {
        mergeBubbleMutation: mutate,
        isPending,
        isError,
        error,
        data,
        reset,
    };
};

export default useMergeBubble;
