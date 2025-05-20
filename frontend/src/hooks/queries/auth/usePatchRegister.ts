import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';

const usePatchRegister = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: () => authService.patchRegister(),
  });

  return {
    patchUserRegisterMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default usePatchRegister;
