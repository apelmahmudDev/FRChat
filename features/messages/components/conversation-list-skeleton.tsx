import { Skeleton } from "@/components/ui/skeleton"

export function ConversationListSkeleton() {
  return (
    <aside className="hidden w-[350px] shrink-0 flex-col border-r bg-card lg:flex">
      <div className="space-y-3 border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="ml-auto size-10 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
      <div className="flex h-16 items-center gap-1 border-b px-5">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-hidden px-4 py-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 flex-1 rounded-full" />
                <Skeleton className="h-3 w-10 rounded-full" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 flex-1 rounded-full" />
                <Skeleton className="size-5 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
