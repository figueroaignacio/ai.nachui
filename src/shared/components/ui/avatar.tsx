import { cn } from '@/shared/lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const avatarVariants = cva('relative flex shrink-0 overflow-hidden rounded-full', {
  variants: {
    size: {
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface AvatarContextValue {
  status: 'loading' | 'loaded' | 'error';
  setStatus: (status: 'loading' | 'loaded' | 'error') => void;
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

function useAvatarContext() {
  const context = React.use(AvatarContext);
  if (!context) throw new Error('Avatar components must be used within Avatar');
  return context;
}

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof avatarVariants> {}

const AvatarRoot = ({ className, size, ...props }: AvatarProps) => {
  const [status, setStatus] = React.useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <AvatarContext value={{ status, setStatus }}>
      <span className={cn(avatarVariants({ size }), className)} {...props} />
    </AvatarContext>
  );
};
AvatarRoot.displayName = 'Avatar';

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: 'loaded' | 'error') => void;
}

const AvatarImage = ({ className, src, ...props }: AvatarImageProps) => {
  const { status, setStatus } = useAvatarContext();

  React.useEffect(() => {
    if (!src) setStatus('error');
    else setStatus('loading');
  }, [src, setStatus]);

  if (status === 'error') return null;

  return (
    <img
      src={src}
      alt=""
      className={cn('aspect-square h-full w-full object-cover', className)}
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('error')}
      {...props}
    />
  );
};
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  const { status } = useAvatarContext();
  if (status === 'loaded') return null;
  return (
    <span
      className={cn(
        'bg-muted flex h-full w-full items-center justify-center rounded-full text-sm font-medium',
        className,
      )}
      {...props}
    />
  );
};
AvatarFallback.displayName = 'AvatarFallback';

const AvatarGroup = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('*:ring-background flex items-center -space-x-2 *:ring-2', className)}
    {...props}
  />
);
AvatarGroup.displayName = 'AvatarGroup';

const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Group: AvatarGroup,
});

export { Avatar, avatarVariants };
