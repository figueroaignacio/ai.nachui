import { createFileRoute } from '@tanstack/react-router'
import { AuthCallbackPage } from '../features/auth/components/auth-callback-page'

export const Route = createFileRoute('/auth/callback')({
  validateSearch: (search: Record<string, unknown>) => ({
    access_token: typeof search.access_token === 'string' ? search.access_token : undefined,
    expires_in: typeof search.expires_in === 'string' ? search.expires_in : undefined,
  }),
  component: AuthCallbackPage,
})
