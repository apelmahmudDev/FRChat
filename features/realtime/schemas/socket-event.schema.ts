import { z } from "zod"

const socketMessageSchema = z
  .object({
    conversationId: z.string().min(1),
    _id: z.string().min(1).optional(),
    sender: z.string().min(1).optional(),
    text: z.string().optional(),
    content: z.string().optional(),
    createdAt: z.iso.datetime().optional(),
  })
  .loose()

export type SocketMessageEvent = z.output<typeof socketMessageSchema>

export const socketMessageEventSchema = z
  .union([
    socketMessageSchema,
    z.object({ message: socketMessageSchema }).loose(),
    z.object({ data: socketMessageSchema }).loose(),
  ])
  .transform((payload): SocketMessageEvent => {
    if ("message" in payload) return payload.message as SocketMessageEvent
    if ("data" in payload) return payload.data as SocketMessageEvent
    return payload as SocketMessageEvent
  })

export const socketConversationEventSchema = z
  .object({
    _id: z.string().min(1).optional(),
    id: z.string().min(1).optional(),
  })
  .loose()
