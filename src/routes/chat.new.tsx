import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '../features/auth/store/auth-store';
import { ChatNewPage } from '../features/chat/components/chat-new-page';

export const Route = createFileRoute('/chat/new')({
  beforeLoad: () => {
    const { token, status } = useAuthStore.getState();
    if (!token || status === 'unauthenticated') {
      throw redirect({ to: '/login' });
    }
  },
  component: ChatNewPage,
});
