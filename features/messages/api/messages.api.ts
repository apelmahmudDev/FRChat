import { z } from "zod"

import { clientApiRequest } from "@/lib/api/client"

import {
  chatMessageSchema,
  type SendMessagePayload,
} from "../types/message.types"

const messageHistorySchema = z.object({
  data: z.array(chatMessageSchema),
  nextCursor: z.string().nullable(),
  hasMore: z.boolean(),
})
const sendMessageResponseSchema = z.object({ ok: z.literal(true) })

export function getMessageHistory(conversationId: string, before?: string) {
  const query = new URLSearchParams({ limit: "20" })
  if (before) query.set("before", before)

  return clientApiRequest(
    `/api/conversations/${encodeURIComponent(conversationId)}/messages?${query}` as `/api/${string}`,
    { method: "GET", schema: messageHistorySchema }
  )
}

export function sendMessage(payload: SendMessagePayload) {
  return clientApiRequest("/api/messages", {
    method: "POST",
    body: payload,
    schema: sendMessageResponseSchema,
  })
}
