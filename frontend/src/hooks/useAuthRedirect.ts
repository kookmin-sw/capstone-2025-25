import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';

const getAccessTokenFromCookie = () => {
  const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    // 스토어에 토큰이 있는 경우
    if (!token) {
      navigate('/today');
      return;
    }

    // 스토어에 토큰이 없지만 쿠키에 토큰이 있는 경우
    const cookieToken = getAccessTokenFromCookie();
    if (cookieToken) {
      setToken(cookieToken);
      navigate('/today');
      return;
    }

    // 토큰이 어디에도 없는 경우
    navigate('/login');
  }, [token, setToken, navigate]);
};
