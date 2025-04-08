'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { fetchMyInfo } from '@/api/auth';
import { useAuthStore } from '@/store/auth';

export default function LoginCallbackPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    fetchMyInfo()
      .then((data) => {
        // 받은 토큰이나 유저 정보 저장
        if (data.token) login(data.token);
        else if (data.id) login('SESSION'); // 세션 기반이라면 임의값
        console.log(data.token);
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('로그인 실패:', err);
        navigate('/login');
      });
  }, [navigate, login]);

  return <p className="text-center mt-10">로그인 중입니다...</p>;
}
