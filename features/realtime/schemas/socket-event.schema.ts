import { z } from "zod"

export const socketMessageEventSchema = z
  .object({
    conversationId: z.string().min(1),
  })
  .loose()

export const socketConversationEventSchema = z
  .object({
    _id: z.string().min(1).optional(),
    id: z.string().min(1).optional(),
  })
  .loose()
