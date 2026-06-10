import { getRouteApi } from '@tanstack/react-router'
import { useRequireAuth } from '../../auth/hooks/use-require-auth'

const routeApi = getRouteApi('/chat/$id')

export function ChatPage() {
  const { id } = routeApi.useParams()
  const { user } = useRequireAuth()

  return (
    <div>
      <h1>Chat</h1>
      {user && <p>User: {user.github_username}</p>}
      <p>Chat ID: {id}</p>
    </div>
  )
}
