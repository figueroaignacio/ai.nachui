import { getGitHubOAuthUrl } from '@/shared/lib/oauth';

export function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <a href={getGitHubOAuthUrl()}>Continue with GitHub</a>
    </div>
  );
}
