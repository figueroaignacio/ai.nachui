import { SidebarRightIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/shared/components/ui/button';
import { Dialog } from '@/shared/components/ui/dialog';
import { SuggestionCard } from '@/shared/components/ui/navigation';
import { Sidebar } from '@/shared/components/ui/sidebar';
import { Typography } from '@/shared/components/ui/typography';
import { AiAvatar } from '@/shared/components/ai-avatar';
import { getGitHubOAuthUrl } from '@/shared/lib/oauth';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function HomePage() {
  const suggestions = [
    { title: 'Analyze UI component' },
    { title: 'Refactor Tailwind styles' },
    { title: 'Optimize state flow' },
    { title: 'Explain system design' },
  ];

  return (
    <div className="bg-background text-foreground flex h-screen w-screen overflow-hidden">
      <Dialog>
        {/* Reusable Sidebar Component */}
        <Sidebar activeItem="new-chat" />

        {/* Main Content Area */}
        <div className="relative flex flex-1 flex-col overflow-y-auto">
          <header className="border-border/60 flex h-14 items-center justify-between border-b px-4 md:hidden">
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="text-muted-foreground flex size-8 cursor-pointer items-center justify-center rounded-lg hover:bg-muted/50 transition-colors"
              >
                <HugeiconsIcon icon={SidebarRightIcon} className="size-5" size={20} />
              </button>
            </Dialog.Trigger>
            <div className="flex items-center gap-2">
              <AiAvatar size="sm" />
              <span className="text-sm font-semibold">NachAI</span>
            </div>
            <div className="size-8" />
          </header>

          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <div className="flex w-full max-w-xl flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-muted border border-border/40 shadow-sm overflow-hidden p-1.5">
                  <AiAvatar size="xl" />
                </div>
                <Typography
                  variant="h3"
                  align="center"
                  className="text-foreground text-xl font-medium tracking-tight mt-2"
                >
                  What can I help with?
                </Typography>
              </div>

              <Dialog.Trigger asChild>
                <button
                  type="button"
                  id="home-chat-input"
                  className="group border-border/50 bg-card/50 text-muted-foreground hover:border-muted-foreground/20 flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors duration-150"
                >
                  <span className="flex-1 text-xs">Send a message...</span>
                  <span className="bg-muted flex size-6 shrink-0 items-center justify-center rounded">
                    <span className="text-muted-foreground text-[10px]">↑</span>
                  </span>
                </button>
              </Dialog.Trigger>

              <div className="flex max-w-2xl flex-wrap justify-center gap-2">
                {suggestions.map((s, idx) => (
                  <SuggestionCard key={idx} title={s.title} />
                ))}
              </div>
            </div>
          </div>

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

        <Dialog.Content className="max-w-sm">
          <Dialog.Header>
            <Dialog.Title>Sign in to continue</Dialog.Title>
            <Dialog.Description>Connect your GitHub account to start chatting.</Dialog.Description>
          </Dialog.Header>

          <div className="pt-2">
            <Button
              variant="outline"
              fullWidth
              className="h-11 cursor-pointer gap-3 text-sm"
              leftIcon={<GitHubIcon className="size-5" />}
              onClick={() => {
                window.location.href = getGitHubOAuthUrl();
              }}
            >
              Continue with GitHub
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
