export interface User {
  id: string
  github_id: string
  github_username: string
  email: string | null
  avatar_url: string | null
  created_at: string
}

export interface AccessTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface AuthState {
  token: string | null
  user: User | null
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}
