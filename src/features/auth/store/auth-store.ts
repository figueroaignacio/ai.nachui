import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, User } from '../types'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      status: 'idle',

      setAuth: (token: string, user: User) =>
        set({ token, user, status: 'authenticated' }),

      clearAuth: () =>
        set({ token: null, user: null, status: 'unauthenticated' }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    },
  ),
)
