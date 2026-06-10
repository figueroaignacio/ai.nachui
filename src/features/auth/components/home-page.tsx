import { getGitHubOAuthUrl } from '../../../shared/lib/oauth'

export function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <a href={getGitHubOAuthUrl()}>Continue with GitHub</a>
    </div>
  )
}
