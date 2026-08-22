import ChatView from "@/features/messages/components/chat-view"
import { getConversations } from "@/features/messages/api/conversations"

type ConversationPageProps = {
  params: Promise<{ conversationId: string }>
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { conversationId } = await params
  const conversations = await getConversations()
  const conversation = conversations.find(({ id }) => id === conversationId)

  return (
    <ChatView
      conversations={conversations}
      conversation={conversation ?? null}
      variant={conversations.length === 0 ? "empty" : "not-found"}
    />
  )
}
