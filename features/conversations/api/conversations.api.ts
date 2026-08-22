import { z } from "zod"

import { clientApiRequest } from "@/lib/api/client"

import type {
  CreateConversationPayload,
  CreateGroupPayload,
} from "../types/conversation.types"
import { conversationSchema } from "../types/conversation.types"

const createdConversationSchema = z.object({
  _id: z.string().min(1),
  participants: z.array(z.string().min(1)),
  createdAt: z.iso.datetime(),
})
const createdGroupSchema = z.object({ _id: z.string().min(1) })
const mutationResponseSchema = z.unknown()
const conversationListSchema = z.object({
  data: z.array(conversationSchema),
})

export function getConversations() {
  return clientApiRequest("/api/conversations", {
    method: "GET",
    schema: conversationListSchema,
  }).then(({ data }) => data)
}

export function createConversation(payload: CreateConversationPayload) {
  return clientApiRequest("/api/conversations", {
    method: "POST",
    body: payload,
    schema: createdConversationSchema,
  })
}

export function createGroup(payload: CreateGroupPayload) {
  return clientApiRequest("/api/conversations/group", {
    method: "POST",
    body: payload,
    schema: createdGroupSchema,
  })
}

export function addParticipants(conversationId: string, userIds: string[]) {
  return clientApiRequest(
    `/api/conversations/${conversationId}/participants` as `/api/${string}`,
    { method: "POST", body: { userIds }, schema: mutationResponseSchema }
  )
}

export function removeParticipant(conversationId: string, userId: string) {
  return clientApiRequest(
    `/api/conversations/${conversationId}/participants/${userId}` as `/api/${string}`,
    { method: "DELETE", schema: mutationResponseSchema }
  )
}

export function promoteAdmin(conversationId: string, userId: string) {
  return clientApiRequest(
    `/api/conversations/${conversationId}/admins` as `/api/${string}`,
    { method: "POST", body: { userId }, schema: mutationResponseSchema }
  )
}

export function renameGroup(conversationId: string, name: string) {
  return clientApiRequest(
    `/api/conversations/${conversationId}` as `/api/${string}`,
    { method: "PATCH", body: { name }, schema: mutationResponseSchema }
  )
}
