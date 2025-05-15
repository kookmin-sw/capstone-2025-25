import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { useAuthStore } from '@/store/authStore';
import { getCookie, setCookie } from '@/utils/cookie';

export const authService = {
  /** accessToken을 받아 상태 + 쿠키에 반영 */
  login: (token: string) => {
    if (!token) {
      console.error('토큰 없음!');
      return;
    }

    setCookie('accessToken', token);
    const { setToken, setTokenValidity } = useAuthStore.getState();
    setToken(token);
    setTokenValidity(true);
  },

  /** 상태 + 쿠키 모두 초기화하고 리다이렉트 */
  logout: () => {
    // 쿠키 제거
    document.cookie = 'accessToken=; path=/; max-age=0';
    document.cookie = 'refreshToken=; path=/; max-age=0';

    // Zustand 상태 초기화
    const { resetAuth } = useAuthStore.getState();
    resetAuth();

    // 리다이렉트
    window.location.href = '/login';
  },

  /** code로 로그인 → 토큰 저장 및 상태 업데이트 */
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

    if (!token) throw new Error('accessToken 없음');

    authService.login(token);
    return token;
  },

  /** 회원 탈퇴 API (accessToken 사용) */
  withdraw: async () => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) throw new Error('accessToken 없음');

    return await apiClient.delete(ENDPOINTS.AUTH.WITHDRAW, {
      data: { accessToken },
      withCredentials: true,
    });
  },

  tryRefresh: async () => {
    const accessToken = getCookie('accessToken');
    const { setToken, setTokenValidity } = useAuthStore.getState();

    if (accessToken && accessToken.trim() !== '') {
      // console.log('🔵 accessToken 이미 존재함 → refresh 생략');
      return;
    }

    try {
      const res = await apiClient.post(
        ENDPOINTS.AUTH.REFRESH_TOKEN,
        {},
        { withCredentials: true },
      );

      const newAccessToken = res.data?.content?.accessToken;
      if (!newAccessToken) throw new Error('accessToken 없음');

      setCookie('accessToken', newAccessToken);
      setToken(newAccessToken);
      setTokenValidity(true);

      // console.log('accessToken 자동 복구 완료');
    } catch (error) {
      setToken(null);
      setTokenValidity(false);

      document.cookie = 'accessToken=; path=/; max-age=0';
      document.cookie = 'refreshToken=; path=/; max-age=0';

      window.location.href = '/login';
    }
  },
};
