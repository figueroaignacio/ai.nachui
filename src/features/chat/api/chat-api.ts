import { fetchWithAuth } from '@/shared/api/fetch-with-auth';

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

export async function createChat(): Promise<ChatRead> {
  const response = await fetchWithAuth('/api/chats', { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to create chat: ${response.status}`);
  }
  return response.json() as Promise<ChatRead>;
}

export async function listChats(): Promise<ChatRead[]> {
  const response = await fetchWithAuth('/api/chats');
  if (!response.ok) {
    throw new Error(`Failed to list chats: ${response.status}`);
  }
  return response.json() as Promise<ChatRead[]>;
}

export async function getMessages(chatId: string): Promise<MessageRead[]> {
  const response = await fetchWithAuth(`/api/chats/${chatId}/messages`);
  if (!response.ok) {
    throw new Error(`Failed to load messages: ${response.status}`);
  }
  return response.json() as Promise<MessageRead[]>;
}

export async function sendMessage(chatId: string, content: string): Promise<Response> {
  return fetchWithAuth(`/api/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}
