import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../features/auth/store/auth-store'
import { ChatPage } from '../features/chat/components/chat-page'

export const Route = createFileRoute('/chat/$id')({
  beforeLoad: () => {
    const { token, status } = useAuthStore.getState()
    if (!token || status === 'unauthenticated') {
      throw redirect({ to: '/login' })
    }
  },
  component: ChatPage,
})
