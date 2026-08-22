import { keepPreviousData, queryOptions } from "@tanstack/react-query"
import { z } from "zod"

import { clientApiRequest } from "@/lib/api/client"

import { conversationKeys, messageKeys } from "./query-keys"

const userSchema = z.object({
  _id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(1),
})
const usersResponseSchema = z.object({ data: z.array(userSchema) })
const mutationResponseSchema = z.unknown()
const sendMessageResponseSchema = z.object({ ok: z.literal(true) })

export type ChatUser = z.infer<typeof userSchema>

export function searchUsers(query: string) {
  const search = new URLSearchParams({ q: query, limit: "10" })
  return clientApiRequest(`/api/users/search?${search}` as `/api/${string}`, {
    method: "GET",
    schema: usersResponseSchema,
  })
}

export const userSearchQueryOptions = (query: string) =>
  queryOptions({
    queryKey: ["users", "search", query] as const,
    queryFn: () => searchUsers(query),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })

export function createGroup(name: string, userIds: string[]) {
  return clientApiRequest("/api/conversations/group", {
    method: "POST",
    body: { name, userIds },
    schema: z.object({ _id: z.string().min(1) }),
  })
}

export function addParticipants(conversationId: string, userIds: string[]) {
  return clientApiRequest(
    `/api/conversations/${conversationId}/participants` as `/api/${string}`,
    {
      method: "POST",
      body: { userIds },
      schema: mutationResponseSchema,
    }
  )
}

export function removeParticipant(conversationId: string, userId: string) {
  return clientApiRequest(
    `/api/conversations/${conversationId}/participants/${userId}` as `/api/${string}`,
    {
      method: "DELETE",
      schema: mutationResponseSchema,
    }
  )
}

export function promoteAdmin(conversationId: string, userId: string) {
  return clientApiRequest(
    `/api/conversations/${conversationId}/admins` as `/api/${string}`,
    {
      method: "POST",
      body: { userId },
      schema: mutationResponseSchema,
    }
  )
}

export function renameGroup(conversationId: string, name: string) {
  return clientApiRequest(
    `/api/conversations/${conversationId}` as `/api/${string}`,
    {
      method: "PATCH",
      body: { name },
      schema: mutationResponseSchema,
    }
  )
}

export function sendMessage(conversationId: string, text: string) {
  return clientApiRequest("/api/messages", {
    method: "POST",
    body: { conversationId, text },
    schema: sendMessageResponseSchema,
  })
}

export function invalidateConversation(
  queryClient: {
    invalidateQueries: (filters: {
      queryKey: readonly unknown[]
    }) => Promise<unknown>
  },
  conversationId: string
) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: conversationKeys.all }),
    queryClient.invalidateQueries({
      queryKey: messageKeys.list(conversationId),
    }),
  ])
}
