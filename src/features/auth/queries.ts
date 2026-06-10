import { queryOptions } from '@tanstack/react-query';
import { fetchWithAuth } from '../../shared/api/fetch-with-auth';
import type { User } from './types';

export const authQueryKeys = {
  me: ['auth', 'me'] as const,
};

export const meQueryOptions = queryOptions({
  queryKey: authQueryKeys.me,
  queryFn: async (): Promise<User> => {
    const response = await fetchWithAuth('/auth/me');

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    return response.json() as Promise<User>;
  },
  staleTime: 5 * 60 * 1000,
  retry: false,
});
