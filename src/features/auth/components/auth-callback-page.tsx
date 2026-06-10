import { useNavigate, getRouteApi } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { meQueryOptions } from '../queries'
import { useAuthStore } from '../store/auth-store'

const routeApi = getRouteApi('/auth/callback')

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const search = routeApi.useSearch()
  const { setAuth, clearAuth } = useAuthStore()

  const accessToken = search.access_token ?? null

  const meQuery = useQuery({
    ...meQueryOptions,
    enabled: !!accessToken,
    queryFn: async () => {
      if (!accessToken) throw new Error('No access token')

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error('Failed to validate token')
      }

      return response.json()
    },
  })

  useEffect(() => {
    if (!accessToken) {
      clearAuth()
      navigate({ to: '/login' })
      return
    }

    if (meQuery.data) {
      setAuth(accessToken, meQuery.data)
      navigate({ to: '/chat/new' })
    }

    if (meQuery.isError) {
      clearAuth()
      navigate({ to: '/login' })
    }
  }, [accessToken, meQuery.data, meQuery.isError, setAuth, clearAuth, navigate])

  if (meQuery.isPending && accessToken) {
    return <div>Completing sign in…</div>
  }

  if (meQuery.isError) {
    return <div>Authentication failed. Redirecting…</div>
  }

  return <div>Completing sign in…</div>
}
