import { useAuthStore } from '../store/auth-store';

export function useRedirectIfAuthenticated() {
  const { status } = useAuthStore();

  return {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'idle' || status === 'loading',
  };
}
