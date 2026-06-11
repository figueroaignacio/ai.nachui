import { useQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { meQueryOptions } from '@/features/auth/queries';
import { useAuthStore } from '@/features/auth/store/auth-store';

const routeApi = getRouteApi('/auth/callback');

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const search = routeApi.useSearch();
  const { setAuth, clearAuth } = useAuthStore();

  const accessToken = search.access_token ?? null;

  const meQuery = useQuery({
    ...meQueryOptions,
    enabled: !!accessToken,
    queryFn: async () => {
      if (!accessToken) throw new Error('No access token');

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to validate token');
      }

      return response.json();
    },
  });

  useEffect(() => {
    if (!accessToken) {
      clearAuth();
      navigate({ to: '/' });
      return;
    }

    if (meQuery.data) {
      setAuth(accessToken, meQuery.data);
      navigate({ to: '/chat/new' });
    }

    if (meQuery.isError) {
      clearAuth();
      navigate({ to: '/' });
    }
  }, [accessToken, meQuery.data, meQuery.isError, setAuth, clearAuth, navigate]);

  if (meQuery.isPending && accessToken) {
    return (
      <div className="bg-background text-foreground flex h-screen w-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto rounded-lg" />
          <Skeleton className="h-4 w-5/6 mx-auto rounded-lg" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (meQuery.isError) {
    return (
      <div className="bg-background text-foreground flex h-screen w-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4 text-center">
          <p className="text-sm text-destructive">Authentication failed. Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground flex h-screen w-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <Skeleton className="h-8 w-3/4 mx-auto rounded-lg" />
        <Skeleton className="h-4 w-5/6 mx-auto rounded-lg" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

