import { AiAvatar } from '@/shared/components/ai-avatar';
import { Dialog } from '@/shared/components/ui/dialog';
import { SuggestionCard } from '@/shared/components/ui/navigation';
import { Sidebar } from '@/shared/components/ui/sidebar';
import { Typography } from '@/shared/components/ui/typography';
import { SidebarRightIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AuthDialog, AuthDialogContent } from './auth-dialog';

export function HomePage() {
  const suggestions = [
    { title: 'Analyze UI component' },
    { title: 'Refactor Tailwind styles' },
    { title: 'Optimize state flow' },
    { title: 'Explain system design' },
  ];

  return (
    <div className="bg-background text-foreground flex h-screen w-screen overflow-hidden">
      <AuthDialog />
      <Dialog>
        <Sidebar activeItem="new-chat" />
        <div className="relative flex flex-1 flex-col overflow-y-auto">
          <header className="border-border/60 flex h-14 items-center justify-between border-b px-4 md:hidden">
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="text-muted-foreground hover:bg-muted/50 flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
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
                <AiAvatar size="xl" />
                <Typography
                  variant="h3"
                  align="center"
                  className="text-foreground mt-2 text-xl font-medium tracking-tight"
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

        <AuthDialogContent />
      </Dialog>
    </div>
  );
}
