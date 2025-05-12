import { useMutation } from '@tanstack/react-query';
import { pomodoroService } from '@/services/pomodoroService';
import { patchPomodoroReq } from '@/types/api/pomodoro';

const usePatchPomodoro = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: ({ data }: { data: patchPomodoroReq }) =>
      pomodoroService.patchPomodoro(data),
  });

  return {
    patchPomodoroMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default usePatchPomodoro;
