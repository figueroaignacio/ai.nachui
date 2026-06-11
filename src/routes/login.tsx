import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@/features/auth/components/login-page';
import { useAuthStore } from '@/features/auth/store/auth-store';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const { status } = useAuthStore.getState();
    if (status === 'authenticated') {
      throw redirect({ to: '/chat/new' });
    }
  },
  component: LoginPage,
});
