import { Book01Icon, Chat01Icon, Search01Icon, SettingsIcon, SidebarLeftIcon, SidebarRightIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { useAuthStore } from '../../../features/auth/store/auth-store';
import { useChatList } from '../../../features/chat/hooks/use-chat-list';
import { SidebarItem } from '../../../shared/components/ui/navigation';
import { useSidebarStore } from '../../../shared/store/sidebar-store';

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
  const { isOpen, isMobileOpen, toggleSidebar, setMobileSidebarOpen } = useSidebarStore();

  const handleItemClick = (callback?: () => void) => {
    callback?.();
    setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Desktop Floating Open Button (visible only when desktop sidebar is closed) */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-foreground border-border/60 bg-card/65 hover:bg-card fixed top-3 left-3 z-40 hidden size-8 cursor-pointer items-center justify-center rounded-lg border shadow-sm transition-all duration-150 md:flex"
          title="Expand sidebar"
        >
          <HugeiconsIcon icon={SidebarRightIcon} className="size-4" size={16} />
        </button>
      )}

      {/* Desktop Sidebar Container (Animated Width) */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 256 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="border-border bg-card hidden shrink-0 flex-col border-r md:flex overflow-hidden relative h-full"
      >
        <div className="w-64 h-full flex flex-col shrink-0">
          <SidebarContent
            activeItem={activeItem}
            onNewChat={() => handleItemClick(onNewChat)}
            onDocsClick={() => handleItemClick(onDocsClick)}
            onSettingsClick={() => handleItemClick(onSettingsClick)}
            onSearchClick={onSearchClick}
            onRefreshReady={onRefreshReady}
            showCollapseButton={true}
            onCollapse={toggleSidebar}
          />
        </div>
      </motion.aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden cursor-pointer"
            />

            {/* Slide-in drawer body */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.32, 0.94, 0.6, 1] }}
              className="border-border bg-card fixed bottom-0 left-0 top-0 z-50 flex w-72 max-w-[80vw] flex-col border-r h-full md:hidden shadow-xl"
            >
              <SidebarContent
                activeItem={activeItem}
                onNewChat={() => handleItemClick(onNewChat)}
                onDocsClick={() => handleItemClick(onDocsClick)}
                onSettingsClick={() => handleItemClick(onSettingsClick)}
                onSearchClick={onSearchClick}
                onRefreshReady={onRefreshReady}
                showCollapseButton={true}
                onCollapse={() => setMobileSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface SidebarContentProps extends SidebarProps {
  showCollapseButton?: boolean;
  onCollapse?: () => void;
}

function SidebarContent({
  activeItem,
  onNewChat,
  onDocsClick,
  onSettingsClick,
  onSearchClick,
  onRefreshReady,
  showCollapseButton,
  onCollapse,
}: SidebarContentProps) {
  const { clearAuth, status } = useAuthStore();
  const navigate = useNavigate();
  const { chats, isLoading, refresh } = useChatList();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  React.useEffect(() => {
    onRefreshReady?.(refresh);
  }, [onRefreshReady, refresh]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-border/60 flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight">Nach AI</span>
        </div>
        {showCollapseButton && (
          <button
            type="button"
            onClick={onCollapse}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer rounded-lg p-1.5 transition-colors duration-150"
            title="Collapse panel"
          >
            <HugeiconsIcon icon={SidebarLeftIcon} className="size-4" size={16} />
          </button>
        )}
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
            {isLoading && chats.length === 0 ? (
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
                    onClick={onCollapse}
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
            type="button"
            onClick={() => {
              clearAuth();
              navigate({ to: '/' });
              onCollapse?.();
            }}
            className="text-destructive hover:bg-destructive/10 w-full rounded-lg px-3 py-1.5 text-left text-xs transition-colors"
          >
            Log out
          </button>
        )}
      </div>
    </div>
  );
}

