export type ConversationType = "direct" | "group"

export type ConversationParticipant = {
  id: string
  name: string
  phone: string
}

export type Conversation = {
  id: string
  type: ConversationType
  name: string
  preview: string
  time: string
  updatedAt: string
  initials: string
  unread?: number
  group?: boolean
  company?: boolean
  members?: number
  participants?: ConversationParticipant[]
}

export function getConversationById(
  conversations: readonly Conversation[],
  conversationId: string
) {
  return conversations.find(({ id }) => id === conversationId)
}

export function getConversationInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) {
    return "?"
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}
