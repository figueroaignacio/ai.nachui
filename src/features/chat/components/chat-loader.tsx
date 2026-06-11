import { Skeleton } from '@/shared/components/ui/skeleton';

export function ChatLoader() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden px-6 py-6">
      <div className="mb-4 flex-1 space-y-6 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="flex w-full justify-end py-2">
            <Skeleton className="h-10 w-[40%] rounded-2xl" />
          </div>
          <div className="border-border/10 flex w-full gap-4 border-b py-6 last:border-b-0">
            <Skeleton className="size-8 shrink-0 animate-pulse rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <Skeleton className="h-4 w-24 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[90%] rounded" />
                <Skeleton className="h-4 w-[85%] rounded" />
                <Skeleton className="h-4 w-[60%] rounded" />
              </div>
            </div>
          </div>
          <div className="flex w-full justify-end py-2">
            <Skeleton className="h-10 w-[30%] rounded-2xl" />
          </div>
          <div className="border-border/10 flex w-full gap-4 border-b py-6 last:border-b-0">
            <Skeleton className="size-8 shrink-0 animate-pulse rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <Skeleton className="h-4 w-24 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[95%] rounded" />
                <Skeleton className="h-4 w-[40%] rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-border/50 bg-card/50 flex w-full items-center gap-3 rounded-lg border px-4 py-2.5">
        <Skeleton className="h-5 flex-1 rounded" />
        <Skeleton className="size-6 rounded" />
      </div>
    </div>
  );
}
