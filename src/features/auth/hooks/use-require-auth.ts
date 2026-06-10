import { useAuthStore } from '../store/auth-store';

export function useRequireAuth() {
  const { token, user, status } = useAuthStore();

  return {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'idle' || status === 'loading',
    token,
    user,
  };
}
