'use client';

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

export default function NaverCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/naver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('token', data.token);
          navigate('/dashboard');
        })
        .catch((err) => {
          console.error('네이버 로그인 실패', err);
          navigate('/login');
        });
    }
  }, [params, navigate]);

  return <p className="text-center mt-10">네이버 로그인 중입니다...</p>;
}
