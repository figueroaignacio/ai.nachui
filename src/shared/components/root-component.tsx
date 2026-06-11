import { Outlet } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function RootComponent() {
  useAuth();
  return <Outlet />;
}
