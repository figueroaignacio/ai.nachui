/**
 * Chat API types and client functions.
 * All requests go through fetchWithAuth so the JWT is always attached.
 */
import { fetchWithAuth } from '../../../shared/api/fetch-with-auth';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatRead {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageRead {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface SSEChunk {
  content: string;
  done: boolean;
}

// ---------------------------------------------------------------------------
// Chat endpoints
// ---------------------------------------------------------------------------

/** Create a new empty chat and return its metadata. */
export async function createChat(): Promise<ChatRead> {
  const response = await fetchWithAuth('/api/chats', { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to create chat: ${response.status}`);
  }
  return response.json() as Promise<ChatRead>;
}

/** Return all chats for the current user, newest first. */
export async function listChats(): Promise<ChatRead[]> {
  const response = await fetchWithAuth('/api/chats');
  if (!response.ok) {
    throw new Error(`Failed to list chats: ${response.status}`);
  }
  return response.json() as Promise<ChatRead[]>;
}

/** Return message history for a given chat. */
export async function getMessages(chatId: string): Promise<MessageRead[]> {
  const response = await fetchWithAuth(`/api/chats/${chatId}/messages`);
  if (!response.ok) {
    throw new Error(`Failed to load messages: ${response.status}`);
  }
  return response.json() as Promise<MessageRead[]>;
}

/**
 * Send a user message and return the raw `Response` so the caller can
 * consume the SSE body stream directly.
 */
export async function sendMessage(chatId: string, content: string): Promise<Response> {
  return fetchWithAuth(`/api/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}
