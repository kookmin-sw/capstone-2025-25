import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isTokenValid: boolean;
  hasHydrated: boolean;

  setToken: (token: string | null) => void;
  setTokenValidity: (valid: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isTokenValid: false,
      hasHydrated: false,

      setToken: (token) => set({ token }),
      setTokenValidity: (valid) => set({ isTokenValid: valid }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      resetAuth: () =>
        set({
          token: null,
          isTokenValid: false,
          hasHydrated: false,
        }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => () => {
        useAuthStore.getState().setHasHydrated(true);
      },
    },
  ),
);
