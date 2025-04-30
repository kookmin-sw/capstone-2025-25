import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';

export const useExchangeCodeForToken = () => {
  const { mutate, isPending, isError, error, data, reset } = useMutation({
    mutationFn: (code: string) => authService.exchangeCodeForToken(code),
  });

  return {
    exchangeCodeForTokenMutation: mutate,
    isPending,
    isError,
    error,
    data,
    reset,
  };
};

export default useExchangeCodeForToken;
