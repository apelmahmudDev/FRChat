import { Skeleton } from "@/components/ui/skeleton"

import { ConversationListSkeleton } from "./conversation-list-skeleton"

export function ChatShellSkeleton() {
  return (
    <div className="flex h-svh w-full overflow-hidden bg-card">
      <div className="relative flex min-h-0 w-full overflow-hidden bg-card">
        <ConversationListSkeleton />
        <section className="flex min-w-0 flex-1 flex-col bg-background">
          <header className="flex h-[82px] items-center justify-between border-b bg-card px-5 sm:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <Skeleton className="size-11 rounded-full" />
              <div className="min-w-0 space-y-2">
                <Skeleton className="h-4 w-40 rounded-full" />
                <Skeleton className="h-3 w-28 rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="hidden size-11 rounded-full sm:block" />
              <Skeleton className="hidden size-11 rounded-full sm:block" />
              <Skeleton className="size-11 rounded-full" />
            </div>
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-5 sm:px-8">
            <div className="mx-auto max-w-3xl space-y-5">
              <div className="flex justify-center">
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <div className="flex items-start gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="max-w-[82%] flex-1 space-y-2">
                  <Skeleton className="h-3 w-32 rounded-full" />
                  <Skeleton className="h-24 w-full rounded-2xl rounded-tl-md" />
                </div>
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-20 w-[72%] rounded-2xl rounded-br-md" />
              </div>
              <div className="flex items-start gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="max-w-[82%] flex-1 space-y-2">
                  <Skeleton className="h-3 w-28 rounded-full" />
                  <Skeleton className="h-12 w-full rounded-2xl rounded-tl-md" />
                </div>
              </div>
            </div>
          </main>
          <footer className="shrink-0 bg-background px-4 pb-4 sm:px-7 sm:pb-6">
            <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-3 shadow-xs">
              <Skeleton className="h-6 w-full rounded-full" />
              <div className="mt-3 flex items-center gap-2">
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="size-9 rounded-full" />
                <Skeleton className="ml-auto size-11 rounded-full" />
              </div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  )
}
