"use client"

import { useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function MessagesError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-xs">
        <h1 className="text-xl font-semibold tracking-tight">
          We could not load conversations
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The messages service returned an error. You can try again or return to
          the inbox.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => unstable_retry()}>
            Try again
          </Button>
          <Link
            href="/messages"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-input bg-background px-3 text-sm font-medium transition hover:bg-muted"
          >
            Back to inbox
          </Link>
        </div>
      </div>
    </div>
  )
}
