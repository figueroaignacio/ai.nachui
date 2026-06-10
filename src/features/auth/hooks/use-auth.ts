import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { meQueryOptions } from '../queries';
import { useAuthStore } from '../store/auth-store';

export function useAuth() {
  const { token, user, status, setAuth, clearAuth } = useAuthStore();

  const meQuery = useQuery({
    ...meQueryOptions,
    enabled: !!token && status !== 'authenticated',
  });

  useEffect(() => {
    if (meQuery.data && token) {
      setAuth(token, meQuery.data);
    }
  }, [meQuery.data, token, setAuth]);

  useEffect(() => {
    if (meQuery.isError && token) {
      clearAuth();
    }
  }, [meQuery.isError, token, clearAuth]);

  const isLoading = !!token && status === 'idle' && meQuery.isPending;

  return {
    token,
    user,
    status,
    isLoading,
    isAuthenticated: status === 'authenticated',
  };
}
