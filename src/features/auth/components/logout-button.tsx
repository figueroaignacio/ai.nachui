import { useAuthStore } from '@/features/auth/store/auth-store';
import { Button } from '@/shared/components/ui/button';
import { Dialog } from '@/shared/components/ui/dialog';
import { useNavigate } from '@tanstack/react-router';

export function LogoutButton({ onCollapse }: { onCollapse?: () => void }) {
  const { clearAuth, status } = useAuthStore();
  const navigate = useNavigate();

  if (status === 'unauthenticated') return null;

  return (
    <Dialog>
      <Dialog.Trigger className="w-full">
        <Button variant="destructive" size="sm" className="w-full">
          Logout
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Description>Are you sure you want to log out?</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            type="button"
            onClick={() => {
              clearAuth();
              navigate({ to: '/' });
              onCollapse?.();
            }}
            variant="destructive"
            size="sm"
          >
            Log out
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
