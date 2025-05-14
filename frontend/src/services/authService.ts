import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { useAuthStore } from '../store/authStore.ts';
import { getCookie } from '@/utils/cookie.ts';

export const authService = {
  login: (token: string) => {
    if (!token) {
      console.error('토큰 없음!');
      return;
    }

    document.cookie = `accessToken=${token}; path=/;`;

    const setToken = useAuthStore.getState().setToken;
    setToken(token);
  },

  logout: () => {
    document.cookie = 'accessToken=; path=/; max-age=0';

    const setToken = useAuthStore.getState().setToken;
    setToken(null);
  },

  /** 로그인 백엔드 요청 후 response 로 받은 code 를 가지고 다시 재요청*/
  exchangeCodeForToken: async (code: string) => {
    const form = new URLSearchParams();
    form.append('code', code);

    const res = await apiClient.post(ENDPOINTS.AUTH.ACCESS_TOKEN, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true,
    });

    const token =
      res.data?.content?.accessToken ??
      res.data?.accessToken ??
      res.data?.token;

    if (!token) {
      throw new Error('accessToken 없음');
    }

    authService.login(token);
    return token;
  },

  withdraw: async () => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) throw new Error('accessToken 없음');

    return await apiClient.delete(ENDPOINTS.AUTH.WITHDRAW, {
      data: {
        accessToken,
      },
      withCredentials: true,
    });
  },
};
