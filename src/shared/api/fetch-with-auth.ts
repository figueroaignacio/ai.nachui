import { useAuthStore } from '../../features/auth/store/auth-store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function fetchWithAuth(path: string, options: FetchOptions = {}): Promise<Response> {
  const { skipAuth = false, ...fetchOptions } = options;
  const token = useAuthStore.getState().token;

  const headers = new Headers(fetchOptions.headers);

  if (token && !skipAuth) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401) {
    useAuthStore.getState().clearAuth();
    window.location.href = '/';
  }

  return response;
}
