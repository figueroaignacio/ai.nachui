import {
  Book01Icon,
  Chat01Icon,
  Menu01Icon,
  Search01Icon,
  SettingsIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { Button } from '../../../shared/components/ui/button'
import { Dialog } from '../../../shared/components/ui/dialog'
import { Typography } from '../../../shared/components/ui/typography'
import { getGitHubOAuthUrl } from '../../../shared/lib/oauth'

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

interface SuggestionCardProps {
  title: string
  description: string
}

function SuggestionCard({ title }: SuggestionCardProps) {
  return (
    <Dialog.Trigger asChild>
      <button
        type="button"
        className="flex cursor-pointer flex-col gap-1 rounded-lg border border-border/40 bg-card/40 p-3 text-left transition-colors duration-150 hover:border-muted-foreground/20 hover:bg-muted/25">
        <span className="text-xs font-medium text-foreground">{title}</span>
      </button>
    </Dialog.Trigger>
  )
}

interface SidebarItemProps {
  icon?: IconSvgElement
  label: string
  active?: boolean
}

function SidebarItem({ icon, label, active = false }: SidebarItemProps) {
  return (
    <Dialog.Trigger asChild>
      <button
        type="button"
        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
          active
            ? 'bg-secondary text-secondary-foreground font-medium'
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        }`}>
        {icon && (
          <HugeiconsIcon icon={icon} className="size-4 shrink-0" size={16} />
        )}
        <span className="truncate">{label}</span>
      </button>
    </Dialog.Trigger>
  )
}

export function HomePage() {
  const suggestions = [
    {
      title: 'Analyze UI component',
      description: 'Check for React best practices & patterns',
    },
    {
      title: 'Refactor Tailwind styles',
      description: 'Improve modern design layout',
    },
    {
      title: 'Optimize state flow',
      description: 'Simplify React context & props',
    },
    {
      title: 'Explain system design',
      description: 'Break down NachUI architecture specs',
    },
  ]

  const chatHistory = [
    'Design landing page header',
    'Fix React hydration mismatch',
    'NachUI button variants outline',
    'Auth store hook composition',
  ]

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Dialog>
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
          <div className="flex h-14 items-center justify-between px-4 border-b border-border/60">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight">
                Nach AI
              </span>
            </div>
          </div>
          <nav className="flex-1 space-y-4 overflow-y-auto p-3">
            <div className="space-y-1">
              <SidebarItem icon={Chat01Icon} label="New Chat" />
              <SidebarItem icon={Book01Icon} label="System Docs" />
            </div>
            <div className="px-1.5">
              <Dialog.Trigger asChild>
                <div className="relative flex cursor-pointer items-center rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1.5 text-muted-foreground hover:border-muted-foreground/20">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    className="size-3.5 shrink-0 opacity-55"
                    size={14}
                  />
                  <span className="ml-2 text-xs select-none">
                    Search chats...
                  </span>
                </div>
              </Dialog.Trigger>
            </div>

            <div className="space-y-2">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Recent Chats
              </span>
              <div className="space-y-0.5">
                {chatHistory.map((chat, idx) => (
                  <SidebarItem key={idx} icon={Chat01Icon} label={chat} />
                ))}
              </div>
            </div>
          </nav>

          <div className="border-t border-border/60 p-3">
            <SidebarItem icon={SettingsIcon} label="Settings" />
          </div>
        </aside>

        <div className="relative flex flex-1 flex-col overflow-y-auto">
          <header className="flex h-14 items-center justify-between border-b border-border/60 px-4 md:hidden">
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="flex size-8 items-center justify-center text-muted-foreground">
                <HugeiconsIcon icon={Menu01Icon} className="size-5" size={20} />
              </button>
            </Dialog.Trigger>
            <span className="text-sm font-semibold">NachAI</span>
          </header>
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <div className="flex w-full max-w-xl flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <Typography
                  variant="h3"
                  align="center"
                  className="text-foreground text-xl font-medium tracking-tight">
                  What can I help with?
                </Typography>
              </div>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  id="home-chat-input"
                  className="group flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-2.5 text-left text-muted-foreground transition-colors duration-150 hover:border-muted-foreground/20">
                  <span className="flex-1 text-xs">Send a message...</span>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded bg-muted">
                    <span className="text-[10px] text-muted-foreground">↑</span>
                  </span>
                </button>
              </Dialog.Trigger>

              <div className="flex max-w-2xl flex-wrap justify-center gap-2">
                {suggestions.map((s, idx) => (
                  <SuggestionCard
                    key={idx}
                    title={s.title}
                    description={s.description}
                  />
                ))}
              </div>
            </div>
          </div>
          <footer className="flex justify-center py-4">
            <Typography
              variant="muted"
              className="text-[10px] text-muted-foreground/40">
              Powered by{' '}
              <a
                href="https://nachui.tech"
                className="font-medium underline underline-offset-4 hover:text-foreground">
                nachui.tech
              </a>
            </Typography>
          </footer>
        </div>

        <Dialog.Content className="max-w-sm">
          <Dialog.Header>
            <Dialog.Title>Sign in to continue</Dialog.Title>
            <Dialog.Description>
              Connect your GitHub account to start chatting.
            </Dialog.Description>
          </Dialog.Header>

          <div className="pt-2">
            <Button
              variant="outline"
              fullWidth
              className="h-11 gap-3 text-sm cursor-pointer"
              leftIcon={<GitHubIcon className="size-5" />}
              onClick={() => {
                window.location.href = getGitHubOAuthUrl()
              }}>
              Continue with GitHub
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  )
}
