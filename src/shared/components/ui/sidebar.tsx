import { Book01Icon, Chat01Icon, Search01Icon, SettingsIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import * as React from 'react';
import { useAuthStore } from '../../../features/auth/store/auth-store';
import { useChatList } from '../../../features/chat/hooks/use-chat-list';
import { SidebarItem } from '../../../shared/components/ui/navigation';

interface SidebarProps {
  activeItem?: string;
  onNewChat?: () => void;
  onDocsClick?: () => void;
  onSettingsClick?: () => void;
  onSearchClick?: () => void;
  /** Attach a refresh callback so parents can trigger a sidebar reload. */
  onRefreshReady?: (refresh: () => void) => void;
}

export function Sidebar({
  activeItem = 'new-chat',
  onNewChat,
  onDocsClick,
  onSettingsClick,
  onSearchClick,
  onRefreshReady,
}: SidebarProps) {
  const { clearAuth, status } = useAuthStore();
  const navigate = useNavigate();
  const { chats, isLoading, refresh } = useChatList();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Notify parent once when refresh function is ready (effect, not render body)
  React.useEffect(() => {
    onRefreshReady?.(refresh);
  }, [onRefreshReady, refresh]);

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
            active={activeItem === 'new-chat' || currentPath === '/chat/new'}
            onClick={onNewChat}
          />
          <SidebarItem
            icon={Book01Icon}
            label="System Docs"
            active={activeItem === 'docs'}
            onClick={onDocsClick}
          />
        </div>

        {/* Search */}
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
            {isLoading ? (
              <p className="text-muted-foreground/50 px-3 py-2 text-xs">Loading...</p>
            ) : chats.length === 0 ? (
              <p className="text-muted-foreground/40 px-3 py-2 text-xs">No chats yet.</p>
            ) : (
              chats.map((chat) => {
                const isActive = activeItem === chat.id || currentPath === `/chat/${chat.id}`;
                return (
                  <Link
                    key={chat.id}
                    to="/chat/$id"
                    params={{ id: chat.id }}
                    search={{ message: undefined }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                      isActive
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <HugeiconsIcon icon={Chat01Icon} className="size-3.5 shrink-0" size={14} />
                    <span className="truncate">
                      {chat.title ?? new Date(chat.created_at).toLocaleDateString()}
                    </span>
                  </Link>
                );
              })
            )}
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
