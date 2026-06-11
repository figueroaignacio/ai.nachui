import { SidebarRightIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { SuggestionCard } from '../../../shared/components/ui/navigation';
import { Sidebar } from '../../../shared/components/ui/sidebar';
import { Skeleton } from '../../../shared/components/ui/skeleton';
import { Typography } from '../../../shared/components/ui/typography';
import { useSidebarStore } from '../../../shared/store/sidebar-store';
import { useChat } from '../hooks/use-chat';
import { ChatInput } from './chat-input';
import { MessageList } from './message-list';

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
  const { toggleMobileSidebar } = useSidebarStore();

  const handleRefreshReady = React.useCallback((refresh: () => void) => {
    refreshSidebarRef.current = refresh;
  }, []);

  const { messages, streamingContent, isStreaming, isSubmitting, isLoading, error, submit } = useChat({
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
            onClick={toggleMobileSidebar}
            className="text-muted-foreground flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-muted/50 transition-colors"
          >
            <HugeiconsIcon icon={SidebarRightIcon} className="size-5" size={20} />
          </button>
          <span className="text-sm font-semibold">NachAI</span>
          <div className="size-8" />
        </header>

        {isLoading ? (
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-6 py-6">
            <div className="mb-4 flex-1 space-y-6 overflow-y-auto">
              <div className="flex flex-col gap-6">
                {/* User message skeleton */}
                <div className="flex w-full justify-end py-2">
                  <Skeleton className="h-10 w-[40%] rounded-2xl" />
                </div>
                {/* Assistant message skeleton */}
                <div className="flex w-full gap-4 border-b border-border/10 py-6 last:border-b-0">
                  <Skeleton className="size-8 shrink-0 rounded-lg animate-pulse" />
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <Skeleton className="h-4 w-24 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[90%] rounded" />
                      <Skeleton className="h-4 w-[85%] rounded" />
                      <Skeleton className="h-4 w-[60%] rounded" />
                    </div>
                  </div>
                </div>
                {/* User message skeleton 2 */}
                <div className="flex w-full justify-end py-2">
                  <Skeleton className="h-10 w-[30%] rounded-2xl" />
                </div>
                {/* Assistant message skeleton 2 */}
                <div className="flex w-full gap-4 border-b border-border/10 py-6 last:border-b-0">
                  <Skeleton className="size-8 shrink-0 rounded-lg animate-pulse" />
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <Skeleton className="h-4 w-24 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[95%] rounded" />
                      <Skeleton className="h-4 w-[40%] rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Input skeleton */}
            <div className="border-border/50 bg-card/50 flex w-full items-center gap-3 rounded-lg border px-4 py-2.5">
              <Skeleton className="h-5 flex-1 rounded" />
              <Skeleton className="size-6 rounded" />
            </div>
          </div>
        ) : messages.length === 0 && !isStreaming && !isSubmitting ? (
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

