'use client';

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore.ts';

export default function LoginCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      console.error('code 파라미터 없음');
      navigate('/login');
      return;
    }

    const form = new URLSearchParams();
    form.append('code', code);

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/token`, form, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((res) => {
        const accessToken = res.data?.content?.accessToken;

        if (!accessToken) {
          console.error('accessToken 누락:', res.data);
          navigate('/login');
          return;
        }

        localStorage.setItem('accessToken', accessToken);
        login(accessToken);

        console.log('accessToken:', accessToken);
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('토큰 발급 실패:', err.response?.data || err.message);
        navigate('/login');
      });
  }, [navigate, searchParams, login]);

  return <p className="text-center mt-10">로그인 처리 중입니다...</p>;
}
