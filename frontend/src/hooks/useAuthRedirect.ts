import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { getCookie } from '@/utils/cookie.ts';
import { authService } from '@/services/authService.ts';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, isTokenValid, setToken } = useAuthStore();

  const cookieToken = getCookie('accessToken');

  useEffect(() => {
    if (!cookieToken && getCookie('refreshToken')) {
      console.log('accessToken 없음 → refreshToken으로 복구 시도');
      authService.tryRefresh().then(() => {
        console.log('tryRefresh 완료');
      });
    } else if (!token && cookieToken) {
      // 상태만 초기화된 경우 쿠키에서 복구
      console.log('상태 초기화 감지 → 쿠키로 복구');
      setToken(cookieToken);
    }
  }, [token, cookieToken, setToken]);

  useEffect(() => {
    const path = location.pathname;

    if (token && isTokenValid && path === '/login') {
      console.log('유효한 로그인 상태 → today로 이동');
      navigate('/today', { replace: true });
    }

    if ((!token || !isTokenValid) && path !== '/login') {
      console.log('토큰 없음 또는 무효 → 로그인 페이지로 이동');
      navigate('/login', { replace: true });
    }
  }, [token, isTokenValid, location.pathname, navigate]);
};
