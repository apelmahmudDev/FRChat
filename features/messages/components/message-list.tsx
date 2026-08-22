"use client"

import { useEffect, useRef } from "react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { LoaderCircle, RefreshCw } from "lucide-react"

import { currentSessionQueryOptions } from "@/features/auth/api/auth.queries"
import { messageHistoryQueryOptions } from "@/features/messages/api/messages.queries"
import type { Conversation } from "@/features/messages/data/conversations"

function formatMessageTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

type MessageListProps = { conversation: Conversation }

export default function MessageList({ conversation }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const sessionQuery = useQuery(currentSessionQueryOptions())
  const historyQuery = useInfiniteQuery(
    messageHistoryQueryOptions(conversation.id)
  )
  const messages =
    historyQuery.data?.pages.flatMap((page) => page.data).toReversed() ?? []
  const latestMessageId = messages.at(-1)?._id

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" })
  }, [conversation.id, latestMessageId])

  if (historyQuery.isPending) {
    return (
      <main
        className="flex min-h-0 flex-1 items-center justify-center bg-background"
        aria-label="Loading messages"
      >
        <LoaderCircle className="size-5 animate-spin text-primary" />
      </main>
    )
  }

  if (historyQuery.isError) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center bg-background px-6">
        <div className="max-w-sm text-center">
          <p className="text-sm font-semibold">Could not load messages</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {historyQuery.error.message}
          </p>
          <button
            type="button"
            onClick={() => void historyQuery.refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-5 sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {historyQuery.hasNextPage && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => void historyQuery.fetchNextPage()}
              disabled={historyQuery.isFetchingNextPage}
              className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs font-medium transition hover:bg-muted/80 disabled:opacity-60"
            >
              {historyQuery.isFetchingNextPage && (
                <LoaderCircle className="size-3.5 animate-spin" />
              )}
              {historyQuery.isFetchingNextPage
                ? "Loading older messages..."
                : "Load older messages"}
            </button>
          </div>
        )}
        {messages.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No messages yet. Say hello to start the conversation.
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender === sessionQuery.data?.user._id
            const sender = conversation.participants?.find(
              ({ id }) => id === message.sender
            )
            return (
              <div
                key={message._id}
                className={
                  isOwnMessage ? "flex justify-end" : "flex items-start gap-3"
                }
              >
                {!isOwnMessage && (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    {sender?.name
                      ? sender.name.slice(0, 2).toUpperCase()
                      : conversation.initials}
                  </span>
                )}
                <div className={isOwnMessage ? "max-w-[72%]" : "max-w-[82%]"}>
                  {!isOwnMessage && (
                    <div className="mb-1.5 flex items-center gap-3 text-xs">
                      <span className="font-semibold">
                        {sender?.name ?? conversation.name}
                      </span>
                      <span className="text-muted-foreground">
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </div>
                  )}
                  <div
                    className={
                      isOwnMessage
                        ? "rounded-2xl rounded-br-md bg-primary/10 px-4 py-3 text-sm leading-6"
                        : "rounded-2xl rounded-tl-md border bg-card px-4 py-3 text-sm leading-6 shadow-xs"
                    }
                  >
                    {message.text || (
                      <span className="text-muted-foreground italic">
                        Unsupported message
                      </span>
                    )}
                    {isOwnMessage && (
                      <div className="mt-1 text-right text-[11px] text-primary">
                        {formatMessageTime(message.createdAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>
    </main>
  )
}
