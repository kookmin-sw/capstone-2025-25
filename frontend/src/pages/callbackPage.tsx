import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { login } from '@/services/loginService.ts';
import axios from 'axios';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setError('code 파라미터가 없습니다.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    const form = new URLSearchParams();
    form.append('code', code);

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/token`, form, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true,
      })
      .then((res) => {
        const token = res.data?.content?.accessToken;
        if (!token) throw new Error('토큰 누락');
        login(token);
        setTimeout(() => navigate('/dashboard'), 1500);
      })
      .catch((err) => {
        setError('토큰 발급 실패: ' + (err.response?.data || err.message));
        setTimeout(() => navigate('/login'), 1500);
      });
  }, [navigate, searchParams]);

  return (
    <p className="text-center mt-10 text-red-500">
      {error || '로그인 처리 중입니다...'}
    </p>
  );
}
