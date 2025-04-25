import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client.ts';
import { authService } from '@/services/authService.ts';
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
      console.log('백엔드 응답:', data);
      const token =
        data?.content?.accessToken ?? data?.accessToken ?? data?.token;

      if (!token) {
        console.error('accessToken 없음', data);
        return;
      }

      authService.login(token);
      navigate('/matrix');
    },

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
  }, [code, mutate]);

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
