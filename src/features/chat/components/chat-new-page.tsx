import { useRequireAuth } from '../../auth/hooks/use-require-auth'

export function ChatNewPage() {
  const { user } = useRequireAuth()

  return (
    <div>
      <h1>New Chat</h1>
      {user && <p>Welcome, {user.github_username}</p>}
    </div>
  )
}
