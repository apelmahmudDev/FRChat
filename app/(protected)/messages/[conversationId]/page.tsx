import { notFound } from "next/navigation"

import ChatView from "@/features/messages/components/chat-view"
import { getConversationById } from "@/features/messages/data/conversations"

type ConversationPageProps = {
  params: Promise<{ conversationId: string }>
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { conversationId } = await params
  const conversation = getConversationById(conversationId)

  if (!conversation) {
    notFound()
  }

  return <ChatView conversation={conversation} />
}
