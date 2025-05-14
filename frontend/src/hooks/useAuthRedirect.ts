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
  const { token, setToken, isTokenValid } = useAuthStore();

  useEffect(() => {
    const cookieToken = getAccessTokenFromCookie();
    const path = location.pathname;

    // 쿠키에만 토큰이 있고, 현재는 토큰이 저장 안 돼 있을 때만 setToken
    if (!token && cookieToken && isTokenValid) {
      setToken(cookieToken);
      return;
    }

    if (isTokenValid && (token || cookieToken) && path === '/login') {
      navigate('/today', { replace: true });
      return;
    }

    // 토큰이 없거나 유효하지 않을 때만 /login 으로
    if ((!token || !isTokenValid) && path !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [token, setToken, isTokenValid, navigate, location.pathname]);
};
