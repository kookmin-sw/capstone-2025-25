import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isTokenValid: boolean;
  setToken: (token: string | null) => void;
  setTokenValidity: (valid: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      isTokenValid: true,
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setTokenValidity: (valid) => set({ isTokenValid: valid }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
