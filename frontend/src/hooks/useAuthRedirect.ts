import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';

const getAccessTokenFromCookie = () => {
  const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

/**
 * 인증 상태를 검사하고, 토큰이 있으면 /matrix로,
 * 없으면 /login으로 이동
 */
export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    if (!token) {
      const cookieToken = getAccessTokenFromCookie();
      if (cookieToken) {
        setToken(cookieToken);
        navigate('/matrix');
        return;
      }
    }

    if (token) {
      navigate('/matrix');
    } else {
      navigate('/login');
    }
  }, [token, setToken, navigate]);
};
