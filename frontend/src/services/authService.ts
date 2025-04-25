import { useAuthStore } from '../store/authStore.ts';

export const authService = {
  login: (token: string) => {
    if (!token) {
      console.error('토큰 없음!');
      return;
    }

    document.cookie = `accessToken=${token}; path=/; max-age=3600`;

    const setToken = useAuthStore.getState().setToken;
    setToken(token);
  },

  logout: () => {
    document.cookie = 'accessToken=; path=/; max-age=0';

    const setToken = useAuthStore.getState().setToken;
    setToken(null);
  },
};
