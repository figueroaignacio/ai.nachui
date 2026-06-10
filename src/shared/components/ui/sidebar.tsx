import { Book01Icon, Chat01Icon, Search01Icon, SettingsIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../../../features/auth/store/auth-store';
import { SidebarItem } from '../../../shared/components/ui/navigation';

interface SidebarProps {
  activeItem?: string;
  onNewChat?: () => void;
  onDocsClick?: () => void;
  onSettingsClick?: () => void;
  onSearchClick?: () => void;
  onChatClick?: (chatName: string) => void;
}

export function Sidebar({
  activeItem = 'new-chat',
  onNewChat,
  onDocsClick,
  onSettingsClick,
  onSearchClick,
  onChatClick,
}: SidebarProps) {
  const { clearAuth, status } = useAuthStore();
  const navigate = useNavigate();

  const chatHistory = [
    { id: '550e8400-e29b-41d4-a716-446655440000', title: 'Design landing page header' },
    { id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', title: 'Fix React hydration mismatch' },
    { id: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6', title: 'NachUI button variants outline' },
    { id: '7e57d004-2b99-4e7a-8f99-aa4db83e1c6b', title: 'Auth store hook composition' },
  ];

  return (
    <aside className="border-border bg-card hidden w-64 shrink-0 flex-col border-r md:flex">
      <div className="border-border/60 flex h-14 items-center justify-between border-b px-4">
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
            className="border-border/60 bg-muted/30 text-muted-foreground hover:border-muted-foreground/20 relative flex cursor-pointer items-center rounded-lg border px-2.5 py-1.5"
          >
            <HugeiconsIcon icon={Search01Icon} className="size-3.5 shrink-0 opacity-55" size={14} />
            <span className="ml-2 text-xs select-none">Search chats...</span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-muted-foreground/60 px-3 text-[10px] font-bold tracking-wider uppercase">
            Recent Chats
          </span>
          <div className="space-y-0.5">
            {chatHistory.map((chat) => (
              <SidebarItem
                key={chat.id}
                icon={Chat01Icon}
                label={chat.title}
                active={activeItem === chat.id}
                onClick={() => onChatClick?.(chat.id)}
              />
            ))}
          </div>
        </div>
      </nav>

      <div className="border-border/60 space-y-1 border-t p-3">
        <SidebarItem
          icon={SettingsIcon}
          label="Settings"
          active={activeItem === 'settings'}
          onClick={onSettingsClick}
        />
        {status === 'authenticated' && (
          <button
            onClick={() => {
              clearAuth();
              navigate({ to: '/' });
            }}
            className="text-destructive hover:bg-destructive/10 w-full rounded-lg px-3 py-1.5 text-left text-xs transition-colors"
          >
            Log out
          </button>
        )}
      </div>
    </aside>
  );
}
