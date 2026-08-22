import { z } from "zod"

import type { MessagePage } from "@/features/messages/types/message.types"

const upstreamMessageSchema = z
  .object({
    _id: z.string().min(1),
    sender: z
      .union([z.string().min(1), z.object({ _id: z.string().min(1) })])
      .transform((sender) =>
        typeof sender === "string" ? sender : sender._id
      ),
    text: z.string().optional(),
    content: z.string().optional(),
    createdAt: z.iso.datetime(),
  })
  .loose()
  .transform(({ content, text, ...message }) => ({
    ...message,
    text: text ?? content ?? "",
  }))

const messagesSchema = z.array(upstreamMessageSchema)
const paginationFields = {
  nextCursor: z.string().nullable().optional(),
  nextBefore: z.string().nullable().optional(),
  hasMore: z.boolean().optional(),
}
const nestedMessagesSchema = z
  .object({ messages: messagesSchema.optional(), ...paginationFields })
  .loose()
const messageHistoryEnvelopeSchema = z
  .object({
    data: z.union([messagesSchema, nestedMessagesSchema]).optional(),
    messages: messagesSchema.optional(),
    pagination: z.object(paginationFields).loose().optional(),
    ...paginationFields,
  })
  .loose()

export function parseMessageHistoryResponse(body: unknown): MessagePage | null {
  const directMessages = messagesSchema.safeParse(body)
  if (directMessages.success) {
    return { data: directMessages.data, nextCursor: null, hasMore: false }
  }

  const parsedEnvelope = messageHistoryEnvelopeSchema.safeParse(body)
  if (!parsedEnvelope.success) return null

  const envelope = parsedEnvelope.data
  const nestedData =
    envelope.data && !Array.isArray(envelope.data) ? envelope.data : undefined
  const messages =
    (Array.isArray(envelope.data) ? envelope.data : undefined) ??
    envelope.messages ??
    nestedData?.messages

  if (!messages) return null

  const nextCursor =
    envelope.nextCursor ??
    envelope.nextBefore ??
    envelope.pagination?.nextCursor ??
    envelope.pagination?.nextBefore ??
    nestedData?.nextCursor ??
    nestedData?.nextBefore ??
    null

  return {
    data: messages,
    nextCursor,
    hasMore:
      envelope.hasMore ??
      envelope.pagination?.hasMore ??
      nestedData?.hasMore ??
      Boolean(nextCursor),
  }
}
