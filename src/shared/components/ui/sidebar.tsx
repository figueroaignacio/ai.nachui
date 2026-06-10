import {
  Book01Icon,
  Chat01Icon,
  Search01Icon,
  SettingsIcon,
} from '@hugeicons/core-free-icons'
import { useNavigate } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { useAuthStore } from '../../../features/auth/store/auth-store'
import { SidebarItem } from '../../../shared/components/ui/navigation'

interface SidebarProps {
  activeItem?: string
  onNewChat?: () => void
  onDocsClick?: () => void
  onSettingsClick?: () => void
  onSearchClick?: () => void
  onChatClick?: (chatName: string) => void
}

export function Sidebar({
  activeItem = 'new-chat',
  onNewChat,
  onDocsClick,
  onSettingsClick,
  onSearchClick,
  onChatClick,
}: SidebarProps) {
  const { clearAuth, status } = useAuthStore()
  const navigate = useNavigate()

  const chatHistory = [
    'Design landing page header',
    'Fix React hydration mismatch',
    'NachUI button variants outline',
    'Auth store hook composition',
  ]

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-14 items-center justify-between px-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight">Nach AI</span>
        </div>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        <div className="space-y-1">
          <SidebarItem
            icon={Chat01Icon}
            label="New Chat"
            active={activeItem === 'new-chat'}
            onClick={onNewChat}
          />
          <SidebarItem
            icon={Book01Icon}
            label="System Docs"
            active={activeItem === 'docs'}
            onClick={onDocsClick}
          />
        </div>

        {/* Search Bar */}
        <div className="px-1.5">
          <div
            onClick={onSearchClick}
            className="relative flex cursor-pointer items-center rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1.5 text-muted-foreground hover:border-muted-foreground/20">
            <HugeiconsIcon
              icon={Search01Icon}
              className="size-3.5 shrink-0 opacity-55"
              size={14}
            />
            <span className="ml-2 text-xs select-none">Search chats...</span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Recent Chats
          </span>
          <div className="space-y-0.5">
            {chatHistory.map((chat, idx) => (
              <SidebarItem
                key={idx}
                icon={Chat01Icon}
                label={chat}
                active={activeItem === chat}
                onClick={() => onChatClick?.(chat)}
              />
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-border/60 p-3 space-y-1">
        <SidebarItem
          icon={SettingsIcon}
          label="Settings"
          active={activeItem === 'settings'}
          onClick={onSettingsClick}
        />
        {status === 'authenticated' && (
          <button
            onClick={() => {
              clearAuth()
              navigate({ to: '/' })
            }}
            className="w-full text-left px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
            Log out
          </button>
        )}
      </div>
    </aside>
  )
}
