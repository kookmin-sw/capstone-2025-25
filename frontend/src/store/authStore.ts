import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  setToken: (token) => set({ token, isAuthenticated: !!token }),
}));
