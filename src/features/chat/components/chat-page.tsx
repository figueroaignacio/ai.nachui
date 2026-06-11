import { Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { SuggestionCard } from '../../../shared/components/ui/navigation';
import { Sidebar } from '../../../shared/components/ui/sidebar';
import { Typography } from '../../../shared/components/ui/typography';
import { useChat } from '../hooks/use-chat';
import { MessageItem } from './message-item';

const routeApi = getRouteApi('/chat/$id');

const SUGGESTIONS = [
  { title: 'Continue from where we left off' },
  { title: 'Summarize this conversation' },
  { title: 'Suggest next steps' },
  { title: 'Explain your reasoning' },
];

export function ChatPage() {
  const { id } = routeApi.useParams();
  const navigate = useNavigate();
  const { message } = routeApi.useSearch();
  const [inputValue, setInputValue] = React.useState('');
  const refreshSidebarRef = React.useRef<(() => void) | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleRefreshReady = React.useCallback((refresh: () => void) => {
    refreshSidebarRef.current = refresh;
  }, []);

  const { messages, streamingContent, isStreaming, isSubmitting, error, submit } = useChat({
    chatId: id,
    onChatCreated: () => {
      refreshSidebarRef.current?.();
    },
  });

  const submittedRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (message && submittedRef.current !== message) {
      submittedRef.current = message;
      // Clear the query param so refresh/back doesn't re-trigger it
      navigate({
        to: '/chat/$id',
        params: { id },
        search: { message: undefined },
        replace: true,
      });
      void submit(message);
    }
  }, [message, id, navigate, submit]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setInputValue('');
    await submit(text);
  };

  const handleRegenerate = React.useCallback(() => {
    const userMsgs = messages.filter((m) => m.role === 'user');
    if (userMsgs.length > 0) {
      const lastUserMsg = userMsgs[userMsgs.length - 1];
      void submit(lastUserMsg.content);
    }
  }, [messages, submit]);

  return (
    <div className="bg-background text-foreground flex h-screen w-screen overflow-hidden">
      <Sidebar
        activeItem={id}
        onNewChat={() => navigate({ to: '/chat/new' })}
        onDocsClick={() => navigate({ to: '/chat/new' })}
        onSettingsClick={() => navigate({ to: '/chat/new' })}
        onRefreshReady={handleRefreshReady}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <header className="border-border/60 flex h-14 items-center justify-between border-b px-4 md:hidden">
          <button
            type="button"
            className="text-muted-foreground flex size-8 items-center justify-center"
          >
            <HugeiconsIcon icon={Menu01Icon} className="size-5" size={20} />
          </button>
          <span className="text-sm font-semibold">NachAI</span>
          <div className="size-8" />
        </header>

        {messages.length === 0 && !isStreaming && !isSubmitting ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <div className="flex w-full max-w-xl flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <Typography
                  variant="h3"
                  align="center"
                  className="text-foreground text-xl font-medium tracking-tight"
                >
                  Chat — {id.slice(0, 8)}…
                </Typography>
              </div>

              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSend}
                disabled={isSubmitting || isStreaming}
              />
              {error && <p className="text-destructive text-xs">{error}</p>}

              <div className="flex max-w-2xl flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <SuggestionCard
                    key={s.title}
                    title={s.title}
                    onClick={() => handleSend(s.title)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-6 py-6">
            <div className="mb-4 flex-1 space-y-4 overflow-y-auto">
              <MessageList
                messages={messages}
                streamingContent={streamingContent}
                isStreaming={isStreaming}
                onRegenerate={handleRegenerate}
              />
              {error && <p className="text-destructive text-xs">{error}</p>}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSend}
              disabled={isSubmitting || isStreaming}
            />
          </div>
        )}

        <footer className="flex justify-center py-4">
          <Typography variant="muted" className="text-muted-foreground/40 text-[10px]">
            Powered by{' '}
            <a
              href="https://nachui.tech"
              className="hover:text-foreground font-medium underline underline-offset-4"
            >
              nachui.tech
            </a>
          </Typography>
        </footer>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  disabled?: boolean;
}

function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
      className="group border-border/50 bg-card/50 text-muted-foreground hover:border-muted-foreground/20 flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors duration-150"
    >
      <input
        type="text"
        placeholder={disabled ? 'Thinking…' : 'Send a message...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="text-foreground placeholder:text-muted-foreground/60 flex-1 bg-transparent text-xs outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="bg-muted hover:bg-primary hover:text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded transition-colors duration-150 disabled:opacity-40"
      >
        {disabled ? (
          <span className="block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <span className="text-[10px]">↑</span>
        )}
      </button>
    </form>
  );
}

interface MessageListProps {
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string }>;
  streamingContent: string;
  isStreaming: boolean;
  onRegenerate?: () => void;
}

function MessageList({ messages, streamingContent, isStreaming, onRegenerate }: MessageListProps) {
  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg, idx) => {
        const isLast = idx === messages.length - 1;
        return (
          <MessageItem
            key={msg.id}
            role={msg.role}
            content={msg.content}
            onRegenerate={isLast && msg.role === 'assistant' ? onRegenerate : undefined}
          />
        );
      })}
      {(isStreaming || streamingContent) && (
        <MessageItem role="assistant" content={streamingContent} isStreaming={true} />
      )}
    </div>
  );
}
