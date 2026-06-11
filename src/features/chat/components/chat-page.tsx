import { useChat } from '@/features/chat/hooks/use-chat';
import { AiAvatar } from '@/shared/components/ai-avatar';
import { Sidebar } from '@/shared/components/ui/sidebar';
import { Typography } from '@/shared/components/ui/typography';
import { useSidebarStore } from '@/shared/store/sidebar-store';
import { SidebarRightIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { ChatInput } from './chat-input';
import { ChatLoader } from './chat-loader';
import { MessageList } from './message-list';

const routeApi = getRouteApi('/chat/$id');

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

  const { messages, streamingContent, isStreaming, isSubmitting, isLoading, error, submit } =
    useChat({
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
        onChatsClick={() => navigate({ to: '/chat/new' })}
        onSettingsClick={() => navigate({ to: '/chat/new' })}
        onRefreshReady={handleRefreshReady}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <header className="border-border/60 flex h-14 items-center justify-between border-b px-4 md:hidden">
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="text-muted-foreground hover:bg-muted/50 flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
          >
            <HugeiconsIcon icon={SidebarRightIcon} className="size-5" size={20} />
          </button>
          <div className="flex items-center gap-2">
            <AiAvatar size="sm" />
            <span className="text-sm font-semibold">NachAI</span>
          </div>
          <div className="size-8" />
        </header>

        {isLoading ? (
          <ChatLoader />
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-2xl px-6 py-6">
                <MessageList
                  messages={messages}
                  streamingContent={streamingContent}
                  isStreaming={isStreaming}
                  onRegenerate={handleRegenerate}
                />
                {error && <p className="text-destructive text-xs">{error}</p>}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="mx-auto w-full max-w-2xl px-6 pb-6">
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSend}
                disabled={isSubmitting || isStreaming}
              />
            </div>
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
