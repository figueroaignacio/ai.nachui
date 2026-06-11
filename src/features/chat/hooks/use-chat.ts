import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { createChat, getMessages, sendMessage, type MessageRead } from '../api/chat-api';
import { useStreamingMessage } from './use-streaming-message';

interface UseChatOptions {
  chatId?: string;
  onChatCreated?: (chatId: string) => void;
}

interface UseChatReturn {
  messages: MessageRead[];
  streamingContent: string;
  isStreaming: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
  submit: (content: string) => Promise<void>;
}

export function useChat({ chatId, onChatCreated }: UseChatOptions = {}): UseChatReturn {
  const navigate = useNavigate();
  const [messages, setMessages] = React.useState<MessageRead[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const {
    content: streamingContent,
    isStreaming,
    start: startStream,
    reset: resetStream,
  } = useStreamingMessage();

  const isMountedRef = React.useRef(true);
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (!chatId) {
      setIsLoading(false);
      setMessages([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);

    getMessages(chatId)
      .then((msgs) => {
        if (!cancelled) {
          setMessages(msgs);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setIsLoading(false);
          const errMsg = err instanceof Error ? err.message : '';
          if (errMsg.includes('404')) {
            navigate({ to: '/chat/new' });
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chatId, navigate]);

  const submit = React.useCallback(
    async (content: string) => {
      if (!content.trim() || isSubmitting || isStreaming) return;

      setIsSubmitting(true);
      setError(null);
      resetStream();

      const prevMessagesList = [...messages];
      let userMessageSaved = false;

      try {
        let activeChatId = chatId;
        if (!activeChatId) {
          const newChat = await createChat();
          activeChatId = newChat.id;
          onChatCreated?.(activeChatId);

          navigate({
            to: '/chat/$id',
            params: { id: activeChatId },
            search: { message: content },
          });

          return;
        }

        const optimisticUser: MessageRead = {
          id: crypto.randomUUID(),
          chat_id: activeChatId,
          role: 'user',
          content,
          created_at: new Date().toISOString(),
        };
        if (isMountedRef.current) setMessages((prev) => [...prev, optimisticUser]);

        // Send and stream
        const response = await sendMessage(activeChatId, content);
        if (!response.ok || !response.body) {
          if (response.status === 404) {
            throw new Error(
              'Chat session not found. It may have been deleted or the database reset. Please start a new chat.',
            );
          }
          throw new Error(`Server error: ${response.status}`);
        }

        userMessageSaved = true;

        if (isMountedRef.current) setIsSubmitting(false);

        await startStream(response.body);

        if (isMountedRef.current) {
          const updated = await getMessages(activeChatId);
          setMessages(updated);
          resetStream();
        }
      } catch (err) {
        if (isMountedRef.current) {
          if (!userMessageSaved) {
            setMessages(prevMessagesList);
          }
          setError(err instanceof Error ? err.message : 'Something went wrong');
          setIsSubmitting(false);
        }
      }
    },
    [
      chatId,
      messages,
      isSubmitting,
      isStreaming,
      navigate,
      onChatCreated,
      resetStream,
      startStream,
    ],
  );

  return { messages, streamingContent, isStreaming, isSubmitting, isLoading, error, submit };
}
