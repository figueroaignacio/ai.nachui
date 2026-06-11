import * as React from 'react';
import { create } from 'zustand';
import { useAuthStore } from '../../auth/store/auth-store';
import { listChats, type ChatRead } from '../api/chat-api';

interface ChatListState {
  chats: ChatRead[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

interface ChatListStore {
  chats: ChatRead[];
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;
  fetchChats: (force?: boolean) => Promise<void>;
  clearChats: () => void;
}

export const useChatListStore = create<ChatListStore>((set, get) => ({
  chats: [],
  isLoading: false,
  error: null,
  hasLoaded: false,
  fetchChats: async (force = false) => {
    // If already loading, don't trigger another fetch
    if (get().isLoading) return;
    // If already loaded and we're not forcing a refresh, don't load again
    if (get().hasLoaded && !force) return;

    set({ isLoading: true, error: null });
    try {
      const data = await listChats();
      set({ chats: data, isLoading: false, hasLoaded: true });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to load chats',
        isLoading: false,
      });
    }
  },
  clearChats: () => set({ chats: [], isLoading: false, error: null, hasLoaded: false }),
}));

export function useChatList(): ChatListState {
  const token = useAuthStore((s) => s.token);
  const { chats, isLoading, error, fetchChats, clearChats } = useChatListStore();

  React.useEffect(() => {
    if (!token) {
      clearChats();
      return;
    }
    void fetchChats();
  }, [token, fetchChats, clearChats]);

  const refresh = React.useCallback(() => {
    void fetchChats(true);
  }, [fetchChats]);

  return { chats, isLoading, error, refresh };
}

