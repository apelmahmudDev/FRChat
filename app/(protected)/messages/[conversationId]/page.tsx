import { getServerConversations } from "@/features/conversations/api/conversations.server"
import ChatView from "@/features/messages/components/chat-view"

type ConversationPageProps = {
  params: Promise<{ conversationId: string }>
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { conversationId } = await params
  const conversations = await getServerConversations()

  return (
    <ChatView
      initialConversations={conversations}
      selectedConversationId={conversationId}
    />
  )
}
