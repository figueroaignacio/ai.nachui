import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '../features/auth/store/auth-store';
import { ChatPage } from '../features/chat/components/chat-page';

export const Route = createFileRoute('/chat/$id')({
  beforeLoad: () => {
    const { token, status } = useAuthStore.getState();
    if (!token || status === 'unauthenticated') {
      throw redirect({ to: '/' });
    }
  },
  validateSearch: (search: Record<string, unknown>) => ({
    message: typeof search.message === 'string' ? search.message : undefined,
  }),
  component: ChatPage,
});
