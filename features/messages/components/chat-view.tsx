"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageCircleMore } from "lucide-react"

import type { Conversation } from "@/features/messages/data/conversations"

import ChatHeader from "./chat-header"
import ConversationList from "./conversation-list"
import InfoPanel from "./info-panel"
import MessageInput from "./message-input"
import MessageList from "./message-list"

type ChatViewProps = {
  conversations: readonly Conversation[]
  conversation: Conversation | null
  variant?: "empty" | "not-found"
}

export default function ChatView({
  conversations,
  conversation,
  variant = "empty",
}: ChatViewProps) {
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true)
  const latestConversation = conversations[0]
  const emptyStateTitle =
    variant === "not-found"
      ? "Conversation not found"
      : "No conversations yet"
  const emptyStateDescription =
    variant === "not-found"
      ? "That conversation may have been removed or you might not have access to it."
      : "Start a new chat and the conversation list will populate here."

  if (!conversation) {
    return (
      <div className="flex h-svh w-full overflow-hidden bg-card">
        <div className="relative flex min-h-0 w-full overflow-hidden bg-card">
          <ConversationList conversations={conversations} />
          <section className="flex min-w-0 flex-1 items-center justify-center bg-background px-6">
            <div className="mx-auto max-w-md rounded-3xl border bg-card p-8 text-center shadow-xs">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MessageCircleMore className="size-6" />
              </div>
              <h1 className="mt-5 text-xl font-semibold tracking-tight">
                {emptyStateTitle}
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {emptyStateDescription}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {latestConversation && variant === "not-found" ? (
                  <Link
                    href={`/messages/${latestConversation.id}`}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    Open latest conversation
                  </Link>
                ) : (
                  <Link
                    href="/messages"
                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    Refresh inbox
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-svh w-full overflow-hidden bg-card">
      <div className="relative flex min-h-0 w-full overflow-hidden bg-card">
        <ConversationList
          conversations={conversations}
          selectedConversationId={conversation.id}
        />
        <section className="flex min-w-0 flex-1 flex-col bg-background">
          <ChatHeader
            conversation={conversation}
            isInfoPanelOpen={isInfoPanelOpen}
            onInfoPanelToggle={() => setIsInfoPanelOpen((isOpen) => !isOpen)}
          />
          <MessageList />
          <MessageInput conversationName={conversation.name} />
        </section>
        {isInfoPanelOpen && (
          <InfoPanel
            conversation={conversation}
            onClose={() => setIsInfoPanelOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
