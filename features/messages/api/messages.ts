import { infiniteQueryOptions } from "@tanstack/react-query"
import { z } from "zod"

import { clientApiRequest } from "@/lib/api/client"

import { messageKeys } from "./query-keys"

export const messageSchema = z.object({
  _id: z.string().min(1),
  sender: z.string().min(1),
  text: z.string(),
  createdAt: z.iso.datetime(),
})

const messageHistorySchema = z.object({
  data: z.array(messageSchema),
  nextCursor: z.string().nullable(),
  hasMore: z.boolean(),
})

export type ChatMessage = z.infer<typeof messageSchema>

export function getMessageHistory(conversationId: string, before?: string) {
  const query = new URLSearchParams({ limit: "20" })
  if (before) query.set("before", before)

  return clientApiRequest(
    `/api/conversations/${encodeURIComponent(conversationId)}/messages?${query}` as `/api/${string}`,
    { method: "GET", schema: messageHistorySchema }
  )
}

export const messageHistoryQueryOptions = (conversationId: string) =>
  infiniteQueryOptions({
    queryKey: messageKeys.list(conversationId),
    queryFn: ({ pageParam }) => getMessageHistory(conversationId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) =>
      page.hasMore ? (page.nextCursor ?? undefined) : undefined,
  })
