import "server-only"

import { cookies } from "next/headers"
import { z } from "zod"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import { normalizeApiError } from "@/lib/api/error"
import { upstreamRequest } from "@/lib/api/server"

import {
  type Conversation,
  getConversationInitials,
} from "../data/conversations"

const upstreamConversationParticipantSchema = z
  .object({
    _id: z.string().min(1),
    name: z.string().min(1),
    phone: z.string().min(1),
  })
  .loose()

const upstreamConversationLastMessageSchema = z
  .object({
    text: z.string().optional(),
    sender: z.string().optional(),
    createdAt: z.iso.datetime().optional(),
  })
  .loose()

const upstreamConversationSchema = z
  .object({
    _id: z.string().min(1),
    type: z.enum(["direct", "group"]),
    lastMessage: upstreamConversationLastMessageSchema.default({}),
    updatedAt: z.iso.datetime(),
    name: z.string().optional(),
    participant: upstreamConversationParticipantSchema.optional(),
    participants: z.array(upstreamConversationParticipantSchema).optional(),
  })
  .loose()

const upstreamConversationsResponseSchema = z
  .object({
    data: z.array(upstreamConversationSchema),
  })
  .loose()

function formatConversationTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

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

  const previousDay = new Date(now)
  previousDay.setDate(now.getDate() - 1)

  const isYesterday =
    date.getFullYear() === previousDay.getFullYear() &&
    date.getMonth() === previousDay.getMonth() &&
    date.getDate() === previousDay.getDate()

  if (isYesterday) {
    return "Yesterday"
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date)
}

function getConversationName(
  conversation: z.infer<typeof upstreamConversationSchema>
) {
  if (conversation.type === "group") {
    return conversation.name ?? "Group conversation"
  }

  return conversation.participant?.name ?? conversation.name ?? "Conversation"
}

function getConversationPreview(
  conversation: z.infer<typeof upstreamConversationSchema>
) {
  const preview = conversation.lastMessage.text?.trim()

  if (preview) {
    return preview
  }

  return "No messages yet"
}

function mapConversation(
  conversation: z.infer<typeof upstreamConversationSchema>
): Conversation {
  const name = getConversationName(conversation)
  const participants = conversation.participants?.map((participant) => ({
    id: participant._id,
    name: participant.name,
    phone: participant.phone,
  }))

  return {
    id: conversation._id,
    type: conversation.type,
    name,
    preview: getConversationPreview(conversation),
    time: formatConversationTime(conversation.updatedAt),
    updatedAt: conversation.updatedAt,
    initials: getConversationInitials(name),
    group: conversation.type === "group",
    members: participants?.length,
    participants,
  }
}

export async function getConversations() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    throw new Error("Authentication required.")
  }

  try {
    const { body, response } = await upstreamRequest("/conversations", {
      token,
    })

    if (!response.ok) {
      const error = normalizeApiError(body, "Unable to load conversations.")
      throw new Error(error.message)
    }

    const parsedResponse = upstreamConversationsResponseSchema.safeParse(body)

    if (!parsedResponse.success) {
      console.error("Invalid /conversations response", parsedResponse.error)
      throw new Error(
        "The conversations service returned an invalid response."
      )
    }

    return parsedResponse.data.data
      .map(mapConversation)
      .sort((left, right) => {
        return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
      })
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    console.error("Conversations API unavailable", error)
    throw new Error("The conversations service is currently unavailable.")
  }
}
