import { Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useNavigate } from '@tanstack/react-router';
import * as React from 'react';
import { SuggestionCard } from '../../../shared/components/ui/navigation';
import { Sidebar } from '../../../shared/components/ui/sidebar';
import { Typography } from '../../../shared/components/ui/typography';
import { useRequireAuth } from '../../auth/hooks/use-require-auth';

export function ChatNewPage() {
  const { user } = useRequireAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = React.useState('new-chat');
  const [messages, setMessages] = React.useState<
    Array<{ role: 'user' | 'assistant'; text: string }>
  >([]);
  const [inputValue, setInputValue] = React.useState('');

  const suggestions = [
    { title: 'Analyze UI component' },
    { title: 'Refactor Tailwind styles' },
    { title: 'Optimize state flow' },
    { title: 'Explain system design' },
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInputValue('');
    // Simulate assistant reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `You asked about: "${text}". How else can I help?`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="bg-background text-foreground flex h-screen w-screen overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        activeItem={activeItem}
        onNewChat={() => {
          setActiveItem('new-chat');
          setMessages([]);
          navigate({ to: '/chat/new' });
        }}
        onDocsClick={() => navigate({ to: '/chat/new' })}
        onSettingsClick={() => navigate({ to: '/chat/new' })}
        onChatClick={(chatId) => {
          navigate({ to: `/chat/${chatId}` });
        }}
      />

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto">
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

        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <div className="flex w-full max-w-xl flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                {user && (
                  <pre className="text-muted-foreground bg-muted/40 border-border/40 max-w-full overflow-x-auto rounded border p-2 font-mono text-[10px] select-all">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                )}
                <Typography
                  variant="h3"
                  align="center"
                  className="text-foreground text-xl font-medium tracking-tight"
                >
                  What can I help with?
                </Typography>
              </div>

              {/* Chat Input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="group border-border/50 bg-card/50 text-muted-foreground hover:border-muted-foreground/20 flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors duration-150"
              >
                <input
                  type="text"
                  placeholder="Send a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="text-foreground placeholder:text-muted-foreground/60 flex-1 bg-transparent text-xs outline-none"
                />
                <button
                  type="submit"
                  className="bg-muted hover:bg-primary hover:text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded transition-colors duration-150"
                >
                  <span className="text-[10px]">↑</span>
                </button>
              </form>

              {/* Suggestions Grid */}
              <div className="flex max-w-2xl flex-wrap justify-center gap-2">
                {suggestions.map((s, idx) => (
                  <SuggestionCard
                    key={idx}
                    title={s.title}
                    onClick={() => handleSendMessage(s.title)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Conversation Flow style */
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-between px-6 py-6">
            <div className="mb-6 space-y-4 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg border px-3 py-2 text-xs ${
                      msg.role === 'user'
                        ? 'bg-secondary text-secondary-foreground border-border/50'
                        : 'bg-card text-foreground border-border/30'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form at bottom */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="group border-border/50 bg-card/50 text-muted-foreground hover:border-muted-foreground/20 flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors duration-150"
            >
              <input
                type="text"
                placeholder="Send a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="text-foreground placeholder:text-muted-foreground/60 flex-1 bg-transparent text-xs outline-none"
              />
              <button
                type="submit"
                className="bg-muted hover:bg-primary hover:text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded transition-colors duration-150"
              >
                <span className="text-[10px]">↑</span>
              </button>
            </form>
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
