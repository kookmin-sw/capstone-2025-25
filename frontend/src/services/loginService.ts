import { useAuthStore } from '../store/authStore.ts';
import { ACCESS_TOKEN_KEY } from '@/constants/auth.ts';

export const login = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token); // 토큰을 브라우저에 저장
  const setToken = useAuthStore.getState().setToken;
  setToken(token);
};

export const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  const setToken = useAuthStore.getState().setToken;
  setToken(null);
};
