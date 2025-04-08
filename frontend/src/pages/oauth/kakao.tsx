'use client';

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

export default function KakaoCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get('code');
    if (code) {
      // 1. 백엔드에 code를 넘겨서 accessToken 요청
      fetch(`${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          // 2. 받은 토큰이나 유저정보 저장
          localStorage.setItem('token', data.token);
          navigate('/dashboard'); // 로그인 후 리다이렉트
        })
        .catch((err) => {
          console.error('카카오 로그인 실패', err);
          navigate('/login');
        });
    }
  }, [params, navigate]);

  return <p className="text-center mt-10">카카오 로그인 중입니다...</p>;
}
