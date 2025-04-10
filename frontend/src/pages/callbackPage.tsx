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
    // const state = searchParams.get('state');
    // const pathname = window.location.pathname;

    // provider 추출 제거 — 현재 URL에는 'kakao', 'naver' 포함되어 있지 않음
    // 백엔드에서 provider 감지 또는 무시 가능한 상황으로 처리

    if (!code) {
      setError('code 파라미터가 없습니다.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    // provider는 선택 사항으로 간주 (백엔드에서 처리 가능하므로 삭제)

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
        console.log('🎟️ 발급된 accessToken:', token);
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
