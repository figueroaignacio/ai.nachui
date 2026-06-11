import * as React from 'react';
import { cn } from '@/shared/lib/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

function Skeleton({ className, ref, ...props }: SkeletonProps) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('bg-muted animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

Skeleton.displayName = 'Skeleton';

export { Skeleton };
export type { SkeletonProps };
