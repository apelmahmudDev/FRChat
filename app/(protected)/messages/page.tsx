import { redirect } from "next/navigation"

import ChatView from "@/features/messages/components/chat-view"
import { getConversations } from "@/features/messages/api/conversations"

export default async function MessagesPage() {
  const conversations = await getConversations()
  const firstConversation = conversations[0]

  if (firstConversation) {
    redirect(`/messages/${firstConversation.id}`)
  }

  return <ChatView conversations={conversations} conversation={null} />
}
