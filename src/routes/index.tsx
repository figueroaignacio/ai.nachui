import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../features/auth/store/auth-store'
import { HomePage } from '../features/auth/components/home-page'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { status } = useAuthStore.getState()
    if (status === 'authenticated') {
      throw redirect({ to: '/chat/new' })
    }
  },
  component: HomePage,
})
