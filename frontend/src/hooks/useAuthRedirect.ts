import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { getCookie } from '@/utils/cookie.ts';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken, isTokenValid, setTokenValidity } = useAuthStore();

  useEffect(() => {
    const cookieToken = getCookie('accessToken');
    const path = location.pathname;

    if (!token && cookieToken) {
      console.log('상태 초기화 감지 → 쿠키로 복구');
      setToken(cookieToken);
      setTokenValidity(true);
      return;
    }

    if ((token || cookieToken) && isTokenValid && path === '/login') {
      navigate('/today', { replace: true });
      return;
    }

    if ((!token || !isTokenValid) && path !== '/login') {
      console.log('잘못된 상태 → 리다이렉트');
      navigate('/login', { replace: true });
    }
  }, [token, setToken, isTokenValid, navigate, location.pathname]);
};
