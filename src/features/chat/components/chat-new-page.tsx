import { SidebarRightIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { AiAvatar } from '@/shared/components/ai-avatar';
import { SuggestionCard } from '@/shared/components/ui/navigation';
import { Sidebar } from '@/shared/components/ui/sidebar';
import { Typography } from '@/shared/components/ui/typography';
import { useSidebarStore } from '@/shared/store/sidebar-store';
import { useChat } from '@/features/chat/hooks/use-chat';
import { ChatInput } from './chat-input';
import { MessageList } from './message-list';

const SUGGESTIONS = [
  { title: 'Analyze UI component' },
  { title: 'Refactor Tailwind styles' },
  { title: 'Optimize state flow' },
  { title: 'Explain system design' },
];

export function ChatNewPage() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = React.useState('');
  const refreshSidebarRef = React.useRef<(() => void) | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { toggleMobileSidebar } = useSidebarStore();

  const handleRefreshReady = React.useCallback((refresh: () => void) => {
    refreshSidebarRef.current = refresh;
  }, []);

  const { messages, streamingContent, isStreaming, isSubmitting, error, submit } = useChat({
    onChatCreated: (newChatId) => {
      refreshSidebarRef.current?.();
      // Navigate is handled inside useChat — no duplicate navigate needed here
      void newChatId;
    },
  });

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

  const hasContent = messages.length > 0 || isStreaming || isSubmitting;

  return (
    <div className="bg-background text-foreground flex h-screen w-screen overflow-hidden">
      <Sidebar
        activeItem="new-chat"
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

        {!hasContent ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <div className="flex w-full max-w-xl flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-3">
                <AiAvatar size="xl" />
                <Typography
                  variant="h3"
                  align="center"
                  className="text-foreground mt-2 text-xl font-medium tracking-tight"
                >
                  What can I help with?
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
