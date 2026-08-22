import "server-only"

import { cookies } from "next/headers"
import { z } from "zod"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import { normalizeApiError } from "@/lib/api/error"
import { upstreamRequest } from "@/lib/api/server"

import {
  type Conversation,
  getConversationInitials,
} from "../types/conversation.types"

const upstreamParticipantSchema = z
  .object({
    _id: z.string().min(1),
    name: z.string().min(1),
    phone: z.string().min(1),
  })
  .loose()

const upstreamConversationSchema = z
  .object({
    _id: z.string().min(1),
    type: z.enum(["direct", "group"]),
    lastMessage: z.object({ text: z.string().optional() }).loose().default({}),
    updatedAt: z.iso.datetime(),
    name: z.string().optional(),
    participant: upstreamParticipantSchema.optional(),
    participants: z.array(upstreamParticipantSchema).optional(),
  })
  .loose()

const upstreamResponseSchema = z
  .object({ data: z.array(upstreamConversationSchema) })
  .loose()

function formatConversationTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""

  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (sameDay) {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  if (isYesterday) return "Yesterday"

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date)
}

function mapConversation(
  conversation: z.infer<typeof upstreamConversationSchema>
): Conversation {
  const name =
    conversation.type === "group"
      ? (conversation.name ?? "Group conversation")
      : (conversation.participant?.name ?? conversation.name ?? "Conversation")
  const upstreamParticipants =
    conversation.participants ??
    (conversation.participant ? [conversation.participant] : undefined)
  const participants = upstreamParticipants?.map((participant) => ({
    id: participant._id,
    name: participant.name,
    phone: participant.phone,
  }))

  return {
    id: conversation._id,
    type: conversation.type,
    name,
    preview: conversation.lastMessage.text?.trim() || "No messages yet",
    time: formatConversationTime(conversation.updatedAt),
    updatedAt: conversation.updatedAt,
    initials: getConversationInitials(name),
    members: conversation.type === "group" ? participants?.length : undefined,
    participants,
  }
}

export async function getServerConversations() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value
  if (!token) throw new Error("Authentication required.")

  const { body, response } = await upstreamRequest("/conversations", { token })

  if (!response.ok) {
    throw new Error(
      normalizeApiError(body, "Unable to load conversations.").message
    )
  }

  const parsed = upstreamResponseSchema.safeParse(body)
  if (!parsed.success) {
    console.error("Invalid /conversations response", parsed.error)
    throw new Error("The conversations service returned an invalid response.")
  }

  return parsed.data.data
    .map(mapConversation)
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    )
}
