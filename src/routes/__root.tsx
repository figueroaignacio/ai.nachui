import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useAuth } from '../features/auth/hooks/use-auth'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  useAuth()
  return <Outlet />
}
