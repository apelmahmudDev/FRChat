import { z } from "zod"

const socketSenderSchema = z
  .union([
    z.string().min(1),
    z.object({ _id: z.string().min(1) }),
    z.object({ id: z.string().min(1) }),
  ])
  .transform((sender) => {
    if (typeof sender === "string") return sender
    if ("_id" in sender) return sender._id
    return sender.id
  })

const socketCreatedAtSchema = z
  .union([z.iso.datetime(), z.number().finite()])
  .transform((createdAt) =>
    typeof createdAt === "number"
      ? new Date(createdAt).toISOString()
      : createdAt
  )

const socketMessageSchema = z
  .object({
    conversationId: z.string().min(1).optional(),
    conversation: z.string().min(1).optional(),
    _id: z.string().min(1).optional(),
    id: z.string().min(1).optional(),
    sender: socketSenderSchema.optional(),
    text: z.string().optional(),
    content: z.string().optional(),
    createdAt: socketCreatedAtSchema.optional(),
  })
  .loose()
  .refine((message) => message.conversationId ?? message.conversation, {
    message: "A socket message must identify its conversation.",
  })
  .transform((message) => ({
    ...message,
    conversationId: message.conversationId ?? message.conversation!,
    _id: message._id ?? message.id,
  }))

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
