import { createFileRoute, redirect } from '@tanstack/react-router';
import { SignupPage } from '@/features/auth/components/signup-page';
import { useAuthStore } from '@/features/auth/store/auth-store';

export const Route = createFileRoute('/signup')({
  beforeLoad: () => {
    const { status } = useAuthStore.getState();
    if (status === 'authenticated') {
      throw redirect({ to: '/chat/new' });
    }
  },
  component: SignupPage,
});
