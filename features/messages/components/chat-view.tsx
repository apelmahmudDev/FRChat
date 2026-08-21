"use client"

import { useState } from "react"

import ChatHeader from "./chat-header"
import ConversationList from "./conversation-list"
import InfoPanel from "./info-panel"
import MessageInput from "./message-input"
import MessageList from "./message-list"

export default function ChatView() {
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true)

  return (
    <div className="flex h-svh w-full overflow-hidden bg-card">
      <div className="relative flex min-h-0 w-full overflow-hidden bg-card">
        <ConversationList />
        <section className="flex min-w-0 flex-1 flex-col bg-background">
          <ChatHeader
            isInfoPanelOpen={isInfoPanelOpen}
            onInfoPanelToggle={() => setIsInfoPanelOpen((isOpen) => !isOpen)}
          />
          <MessageList />
          <MessageInput />
        </section>
        {isInfoPanelOpen && (
          <InfoPanel onClose={() => setIsInfoPanelOpen(false)} />
        )}
      </div>
    </div>
  )
}
