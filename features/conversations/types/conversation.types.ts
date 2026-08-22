import { z } from "zod"

export type CreateConversationPayload = { userId: string }
export type CreateGroupPayload = { name: string; participantIds: string[] }

export const conversationParticipantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(1),
})

export const conversationSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["direct", "group"]),
  name: z.string().min(1),
  preview: z.string(),
  time: z.string(),
  updatedAt: z.iso.datetime(),
  initials: z.string().min(1),
  members: z.number().int().nonnegative().optional(),
  participants: z.array(conversationParticipantSchema).optional(),
})

export type ConversationParticipant = z.infer<
  typeof conversationParticipantSchema
>
export type Conversation = z.infer<typeof conversationSchema>

export function getConversationById(
  conversations: readonly Conversation[],
  conversationId: string
) {
  return conversations.find(({ id }) => id === conversationId)
}

export function getConversationInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return "?"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}
