"use client"

import { useState } from "react"

import type { Conversation } from "@/features/messages/data/conversations"

import ChatHeader from "./chat-header"
import ConversationList from "./conversation-list"
import InfoPanel from "./info-panel"
import MessageInput from "./message-input"
import MessageList from "./message-list"

type ChatViewProps = {
  conversation: Conversation
}

export default function ChatView({ conversation }: ChatViewProps) {
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true)

  return (
    <div className="flex h-svh w-full overflow-hidden bg-card">
      <div className="relative flex min-h-0 w-full overflow-hidden bg-card">
        <ConversationList selectedConversationId={conversation.id} />
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
