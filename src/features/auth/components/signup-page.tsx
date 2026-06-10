import { getGitHubOAuthUrl } from '../../../shared/lib/oauth'

export function SignupPage() {
  return (
    <div>
      <h1>Sign Up</h1>
      <a href={getGitHubOAuthUrl()}>Continue with GitHub</a>
    </div>
  )
}
