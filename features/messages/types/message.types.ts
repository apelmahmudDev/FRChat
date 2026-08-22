import { z } from "zod"

export const chatMessageSchema = z.object({
  _id: z.string().min(1),
  sender: z.string().min(1),
  text: z.string(),
  createdAt: z.iso.datetime(),
})

export type ChatMessage = z.infer<typeof chatMessageSchema>
export type SendMessagePayload = { conversationId: string; text: string }

export type MessagePage = {
  data: ChatMessage[]
  nextCursor: string | null
  hasMore: boolean
}

export type MessageHistory = {
  pages: MessagePage[]
  pageParams: unknown[]
}
