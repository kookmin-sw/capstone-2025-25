import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client.ts';
import { authService } from '@/services/loginService';
import { ENDPOINTS } from '@/api/endpoints.ts';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (code: string) => {
      const form = new URLSearchParams();
      form.append('code', code);
      const res = await apiClient.post(ENDPOINTS.AUTH.ACCESS_TOKEN, form, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      const token = data?.content?.accessToken;
      if (!token) {
        throw new Error('토큰 누락');
      }
      authService.login(token);
      navigate('/dashboard');
    },
    onError: () => {
      setTimeout(() => navigate('/login'), 1500);
    },
  });

  useEffect(() => {
    if (code) {
      mutate(code);
    }
  }, [code, mutate]);

  return (
    <p className="text-center mt-10 text-red-500">
      {error
        ? `토큰 발급 실패: ${error instanceof Error ? error.message : '오류'}`
        : isPending
          ? '로그인 처리 중입니다...'
          : ''}
    </p>
  );
}
