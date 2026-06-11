import * as React from 'react';
import { useAuthStore } from '../../auth/store/auth-store';
import { listChats, type ChatRead } from '../api/chat-api';

interface ChatListState {
  chats: ChatRead[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useChatList(): ChatListState {
  const token = useAuthStore((s) => s.token);
  const [chats, setChats] = React.useState<ChatRead[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChats([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    listChats()
      .then((data) => {
        if (!cancelled) setChats(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load chats');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, tick]);

  const refresh = React.useCallback(() => setTick((t) => t + 1), []);

  return { chats, isLoading, error, refresh };
}
