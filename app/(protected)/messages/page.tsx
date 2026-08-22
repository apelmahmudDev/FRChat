import { redirect } from "next/navigation"

import { getServerConversations } from "@/features/conversations/api/conversations.server"
import ChatView from "@/features/messages/components/chat-view"

export default async function MessagesPage() {
  const conversations = await getServerConversations()
  const firstConversation = conversations[0]

  if (firstConversation) {
    redirect(`/messages/${firstConversation.id}`)
  }

  return <ChatView initialConversations={conversations} />
}
