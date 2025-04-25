import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService.ts';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  const { mutate, isPending, error } = useMutation({
    mutationFn: (code: string) => authService.exchangeCodeForToken(code),
    onSuccess: () => navigate('/matrix'),
    onError: (error) => {
      console.error('토큰 발급 실패:', error);
      navigate('/login');
    },
  });

  useEffect(() => {
    if (!code) {
      navigate('/login');
    } else {
      mutate(code);
    }
  }, [code, mutate, navigate]);

  return (
    <p className="text-center mt-10">
      {error
        ? `토큰 발급 실패: ${error.message}`
        : isPending
          ? '로그인 처리 중입니다...'
          : ''}
    </p>
  );
}
