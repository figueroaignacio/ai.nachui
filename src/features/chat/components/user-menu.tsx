import { LogoutButton } from '@/features/auth/components/logout-button';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { Avatar } from '@/shared/components/ui/avatar';
import { DropdownMenu } from '@/shared/components/ui/dropdown-menu';

interface UserMenuProps {
  onCollapse?: () => void;
}

export function UserMenu({ onCollapse }: UserMenuProps) {
  const { user, status } = useAuthStore();

  if (status !== 'authenticated' || !user) return null;

  const initials = user.github_username.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="hover:bg-muted/50 flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors duration-150"
        >
          <Avatar size="sm">
            <Avatar.Image src={user.avatar_url ?? undefined} alt={user.github_username} />
            <Avatar.Fallback className="text-xs font-semibold">{initials}</Avatar.Fallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col items-start text-left">
            <span className="text-foreground truncate text-xs font-semibold">
              {user.github_username}
            </span>
            {user.email && (
              <span className="text-muted-foreground truncate text-[10px]">{user.email}</span>
            )}
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="start" sideOffset={6}>
        <DropdownMenu.Label>{user.github_username}</DropdownMenu.Label>
        {user.email && (
          <div className="text-muted-foreground truncate px-3 pb-2 text-[11px]">{user.email}</div>
        )}
        <DropdownMenu.Separator />
        <div className="p-1">
          <LogoutButton onCollapse={onCollapse} />
        </div>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
