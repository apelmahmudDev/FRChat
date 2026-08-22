import { cookies } from "next/headers"
import { z } from "zod"

import { AUTH_COOKIE_NAME } from "@/features/auth/lib/auth-cookie"
import { normalizeApiError } from "@/lib/api/error"
import { upstreamRequest } from "@/lib/api/server"

const paramsSchema = z.object({ conversationId: z.string().min(1) })
const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  before: z.string().min(1).optional(),
})
const messageSchema = z
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

function getMessagesResponse(body: unknown) {
  const rawMessages = z.array(messageSchema).safeParse(body)
  if (rawMessages.success) {
    return { data: rawMessages.data, nextCursor: null, hasMore: false }
  }

  const parsed = z
    .object({
      data: z.array(messageSchema).optional(),
      messages: z.array(messageSchema).optional(),
      pagination: z
        .object({
          nextCursor: z.string().nullable().optional(),
          nextBefore: z.string().nullable().optional(),
          hasMore: z.boolean().optional(),
        })
        .optional(),
      nextCursor: z.string().nullable().optional(),
      nextBefore: z.string().nullable().optional(),
      hasMore: z.boolean().optional(),
    })
    .loose()
    .safeParse(body)

  if (!parsed.success) return null

  const nestedData = z
    .object({
      messages: z.array(messageSchema).optional(),
      nextCursor: z.string().nullable().optional(),
      nextBefore: z.string().nullable().optional(),
      hasMore: z.boolean().optional(),
    })
    .safeParse(parsed.data.data)
  const messages =
    parsed.data.data ??
    parsed.data.messages ??
    (nestedData.success ? nestedData.data.messages : undefined)
  if (!messages) return null

  const nextCursor =
    parsed.data.nextCursor ??
    parsed.data.nextBefore ??
    parsed.data.pagination?.nextCursor ??
    parsed.data.pagination?.nextBefore ??
    (nestedData.success
      ? (nestedData.data.nextCursor ?? nestedData.data.nextBefore)
      : null) ??
    null
  return {
    data: messages,
    nextCursor,
    hasMore:
      parsed.data.hasMore ??
      parsed.data.pagination?.hasMore ??
      (nestedData.success ? nestedData.data.hasMore : undefined) ??
      Boolean(nextCursor),
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const routeParams = paramsSchema.safeParse(await params)
  const query = querySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  )

  if (!routeParams.success || !query.success) {
    return Response.json(
      { message: "Invalid message history request." },
      { status: 400 }
    )
  }

  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value
  if (!token) {
    return Response.json(
      { message: "Authentication required.", code: "UNAUTHENTICATED" },
      { status: 401 }
    )
  }

  const search = new URLSearchParams({ limit: String(query.data.limit) })
  if (query.data.before) search.set("before", query.data.before)

  try {
    const { body, response } = await upstreamRequest(
      `/conversations/${encodeURIComponent(routeParams.data.conversationId)}/messages?${search}`,
      { token }
    )

    if (!response.ok) {
      return Response.json(
        normalizeApiError(body, "Unable to load message history."),
        {
          status: response.status,
        }
      )
    }

    const messages = getMessagesResponse(body)
    if (!messages) {
      console.error("Invalid GET /conversations/:id/messages response", body)
      return Response.json(
        { message: "The messages service returned an invalid response." },
        { status: 502 }
      )
    }

    return Response.json(messages)
  } catch (error) {
    console.error("Unable to load message history", error)
    return Response.json(
      { message: "The messages service is currently unavailable." },
      { status: 503 }
    )
  }
}
