import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';

const getAccessTokenFromCookie = () => {
  const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    const cookieToken = getAccessTokenFromCookie();
    const path = location.pathname;

    // 1. 쿠키에만 토큰이 있는 경우 → 스토어에 저장
    if (!token && cookieToken) {
      setToken(cookieToken);
      return;
    }

    // 2. 로그인된 상태에서 /login 접근 시 메인으로 리디렉트
    if ((token || cookieToken) && path === '/login') {
      navigate('/today', { replace: true });
      return;
    }

    // 3. 토큰이 아예 없는 상태에서 로그인 페이지가 아니라면 → 로그인으로
    if (!token && !cookieToken && path !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [token, setToken, navigate, location.pathname]);
};
